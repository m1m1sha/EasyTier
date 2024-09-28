use std::{
    sync::atomic::{AtomicBool, AtomicU64, Ordering},
    time::Duration,
};

use anyhow::Context;
use chrono::{DateTime, Local};
use dashmap::DashMap;
use easytier::{
    common::{
        config::{
            ConfigLoader, Flags, NetworkIdentity, PeerConfig, TomlConfigLoader, VpnPortalConfig,
        },
        global_ctx::GlobalCtxEvent,
    },
    launcher::NetworkInstance,
    utils::{NewFilterSender, PeerRoutePair},
};
use serde::{Deserialize, Serialize};

use tauri::{AppHandle, Emitter};

use crate::constant::*;

#[derive(Default, Deserialize, Serialize, PartialEq, Debug)]
pub enum NetworkingMethod {
    #[default]
    PublicServer,
    Manual,
    Standalone,
}

#[derive(Deserialize, Serialize, Debug, Default)]
pub struct NetworkConfig {
    instance_id: String,

    dhcp: bool,
    virtual_ipv4: String,
    hostname: Option<String>,
    network_name: String,
    network_secret: String,
    networking_method: NetworkingMethod,

    public_server_url: String,
    peer_urls: Vec<String>,

    proxy_cidrs: Vec<String>,

    enable_vpn_portal: bool,
    vpn_portal_listen_port: i32,
    vpn_portal_client_network_addr: String,
    vpn_portal_client_network_len: i32,

    advanced_settings: bool,

    listener_urls: Vec<String>,
    rpc_port: i32,
    latency_first: bool,
}

impl NetworkConfig {
    pub fn from_str(s: &str) -> Result<TomlConfigLoader, anyhow::Error> {
        Ok(TomlConfigLoader::new_from_str(s)?)
    }

    fn gen_config(&self) -> Result<TomlConfigLoader, anyhow::Error> {
        let cfg = TomlConfigLoader::default();
        cfg.set_id(
            self.instance_id
                .parse()
                .with_context(|| format!("failed to parse instance id: {}", self.instance_id))?,
        );
        cfg.set_hostname(self.hostname.clone());
        cfg.set_dhcp(self.dhcp);
        cfg.set_inst_name(self.network_name.clone());
        cfg.set_network_identity(NetworkIdentity::new(
            self.network_name.clone(),
            self.network_secret.clone(),
        ));

        if !self.dhcp {
            if self.virtual_ipv4.len() > 0 {
                cfg.set_ipv4(Some(self.virtual_ipv4.parse().with_context(|| {
                    format!("failed to parse ipv4 address: {}", self.virtual_ipv4)
                })?))
            }
        }

        match self.networking_method {
            NetworkingMethod::PublicServer => {
                cfg.set_peers(vec![PeerConfig {
                    uri: self.public_server_url.parse().with_context(|| {
                        format!(
                            "failed to parse public server uri: {}",
                            self.public_server_url
                        )
                    })?,
                }]);
            }
            NetworkingMethod::Manual => {
                let mut peers = vec![];
                for peer_url in self.peer_urls.iter() {
                    if peer_url.is_empty() {
                        continue;
                    }
                    peers.push(PeerConfig {
                        uri: peer_url
                            .parse()
                            .with_context(|| format!("failed to parse peer uri: {}", peer_url))?,
                    });
                }

                cfg.set_peers(peers);
            }
            NetworkingMethod::Standalone => {}
        }

        let mut listener_urls = vec![];
        for listener_url in self.listener_urls.iter() {
            if listener_url.is_empty() {
                continue;
            }
            listener_urls.push(
                listener_url
                    .parse()
                    .with_context(|| format!("failed to parse listener uri: {}", listener_url))?,
            );
        }
        cfg.set_listeners(listener_urls);

        for n in self.proxy_cidrs.iter() {
            cfg.add_proxy_cidr(
                n.parse()
                    .with_context(|| format!("failed to parse proxy network: {}", n))?,
            );
        }

        cfg.set_rpc_portal(
            format!("0.0.0.0:{}", self.rpc_port)
                .parse()
                .with_context(|| format!("failed to parse rpc portal port: {}", self.rpc_port))?,
        );

        if self.enable_vpn_portal {
            let cidr = format!(
                "{}/{}",
                self.vpn_portal_client_network_addr, self.vpn_portal_client_network_len
            );
            cfg.set_vpn_portal_config(VpnPortalConfig {
                client_cidr: cidr
                    .parse()
                    .with_context(|| format!("failed to parse vpn portal client cidr: {}", cidr))?,
                wireguard_listen: format!("0.0.0.0:{}", self.vpn_portal_listen_port)
                    .parse()
                    .with_context(|| {
                        format!(
                            "failed to parse vpn portal wireguard listen port. {}",
                            self.vpn_portal_listen_port
                        )
                    })?,
            });
        }
        let mut flags = Flags::default();
        flags.latency_first = self.latency_first;
        cfg.set_flags(flags);
        Ok(cfg)
    }
}

static INSTANCE_MAP: once_cell::sync::Lazy<DashMap<String, NetworkInstance>> =
    once_cell::sync::Lazy::new(DashMap::new);

pub static mut LOGGER_LEVEL_SENDER: once_cell::sync::Lazy<Option<NewFilterSender>> =
    once_cell::sync::Lazy::new(Default::default);

static EMIT_INSTANCE_INFO: once_cell::sync::Lazy<AtomicBool> =
    once_cell::sync::Lazy::new(|| AtomicBool::new(false));
    
static EMIT_INSTANCE_INFO_DELAY: once_cell::sync::Lazy<AtomicU64> =
    once_cell::sync::Lazy::new(|| AtomicU64::new(3));

#[tauri::command]
pub fn easytier_version() -> Result<String, String> {
    Ok(easytier::VERSION.to_string())
}

#[tauri::command]
pub fn is_autostart() -> Result<bool, String> {
    let args: Vec<String> = std::env::args().collect();
    println!("{:?}", args);
    Ok(args.contains(&AUTOSTART_ARG.to_owned()))
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn parse_network_config(cfg: String) -> Result<String, String> {
    let toml = NetworkConfig::from_str(&cfg).map_err(|e| e.to_string())?;
    Ok(toml.dump())
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct InstanceInstantData {
    id: String,
    ipv4: String,
    version: String,
    hostname: String,
    nat_type: String,
    events: Vec<(DateTime<Local>, GlobalCtxEvent)>,
    prps: Vec<PeerRoutePair>,
    status: bool,
    stat: InstanceTimePeer,
}

#[derive(Deserialize, Serialize, PartialEq, Debug)]
pub struct InstanceTimePeer {
    time: i64,
    peers: Vec<InstancePeer>,
}

#[derive(Deserialize, Serialize, PartialEq, Debug)]
pub struct InstancePeer {
    id: String,
    name: String,
    ipv4: Option<String>,
    ipv6: Option<String>,
    version: String,
    up: u64,
    down: u64,
    cost: i32,
    lost: f64,
    latency: f64,
}

#[tauri::command]
pub async fn run_network_instance(app: AppHandle, cfg: String) -> Result<(), String> {
    println!("instance config: {:?}", cfg.clone());
    let cfg = NetworkConfig::from_str(&cfg).map_err(|e| e.to_string())?;
    let instance_id = cfg.get_id().to_string();
    let network = cfg.get_network_identity().clone();

    if INSTANCE_MAP.contains_key(&instance_id) {
        return Err("instance already exists".to_string());
    }

    let mut instance = NetworkInstance::new(cfg);
    instance.start().map_err(|e| e.to_string())?;

    println!("instance {} started in {:?}", instance_id, network);
    INSTANCE_MAP.insert(instance_id, instance);

    if !EMIT_INSTANCE_INFO.load(Ordering::Relaxed) {
        EMIT_INSTANCE_INFO.store(true, Ordering::Relaxed);
        tokio::spawn(async move {
            let mut ret = vec![];
            let mut flag = 0;
            loop {
                let now = Local::now().timestamp_millis();
                for instance in INSTANCE_MAP.iter() {
                    if let Some(info) = instance.get_running_info() {
                        let peers = info
                            .peer_route_pairs
                            .iter()
                            .map(|prp| {
                                return InstancePeer {
                                    id: prp.route.inst_id.clone(),
                                    name: prp.route.hostname.clone(),
                                    ipv4: Some(prp.route.ipv4_addr.clone()),
                                    ipv6: None,
                                    version: prp.route.version.clone(),
                                    cost: prp.route.cost,
                                    latency: prp.get_latency_ms().unwrap_or_default(),
                                    lost: prp.get_loss_rate().unwrap_or_default(),
                                    up: prp.get_tx_bytes().unwrap_or_default(),
                                    down: prp.get_rx_bytes().unwrap_or_default(),
                                };
                            })
                            .collect();
                        println!("instance {} peers {:?} ", instance.key(), info.peer_route_pairs);
                        ret.push(InstanceInstantData {
                            id: instance.key().clone().to_lowercase(),
                            events: info.events,
                            status: info.running,
                            ipv4: info.my_node_info.virtual_ipv4,
                            version: info.my_node_info.version,
                            hostname: info.my_node_info.hostname,
                            nat_type: info
                                .my_node_info
                                .stun_info
                                .udp_nat_type()
                                .as_str_name()
                                .to_string(),
                            prps: info.peer_route_pairs.clone(),
                            stat: InstanceTimePeer { time: now, peers },
                        });
                    }
                }

                if ret.is_empty() {
                    flag += 1;
                    if flag > 5 {
                        EMIT_INSTANCE_INFO.store(false, Ordering::Relaxed);
                        break;
                    }
                } else if flag != 0 {
                    flag = 0;
                }

                let _ = app.emit(INSTANCE_INFO_EVENT, &ret);
                ret.clear();
                tokio::time::sleep(Duration::from_secs(EMIT_INSTANCE_INFO_DELAY.load(Ordering::Relaxed))).await;
            }
        });
    }
    Ok(())
}

#[tauri::command]
pub fn stop_network_instance(id: String) -> Result<(), String> {
    let _ = INSTANCE_MAP.remove(&id);
    Ok(())
}

#[tauri::command]
pub fn get_os_hostname() -> Result<String, String> {
    Ok(gethostname::gethostname().to_string_lossy().to_string())
}

#[tauri::command]
pub fn set_logging_level(level: String) -> Result<(), String> {
    let sender = unsafe { LOGGER_LEVEL_SENDER.as_ref().unwrap() };
    sender.send(level).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn set_tun_fd(instance_id: String, fd: i32) -> Result<(), String> {
    let mut instance = INSTANCE_MAP
        .get_mut(&instance_id)
        .ok_or("instance not found")?;
    instance.set_tun_fd(fd);
    Ok(())
}
