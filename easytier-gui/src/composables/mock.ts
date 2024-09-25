import { rand } from '@vueuse/core'
import type { InstanceData, InstanceTimePeer } from '~/types/components'

export function instancesMock(length = 3) {
  return Array.from(Array.from({ length }).keys()).map((i) => {
    const segment2 = rand(1, 254)
    const segment3 = rand(1, 254)
    const ipv4 = `10.${segment2}.${segment3}.${i + 2}`
    const status = rand(0, 1) > 0.7
    const stats: InstanceTimePeer[] = Array.from(Array.from({ length: 10 }).keys()).map((i) => {
      const deviceTotal = rand(1, 25)
      return {
        time: new Date().getTime() - (i * 1000 * 100),
        peers: Array.from(Array.from({ length: deviceTotal }).keys()).map((ii) => {
          return {
            id: `${ii + 1}` || crypto.randomUUID(),
            name: ii === 0 ? `host-${i}` : generateRandomString(6),
            ipv4: status ? ii === 0 ? ipv4 : `10.${segment2}.${segment3}.${ii + 2}` : undefined,
            ipv6: undefined,
            version: Math.round(rand(0, 1)) ? `2.0.0` : undefined,
            up: ii === 0 ? 0 : rand(1, 1024 * 1024),
            down: ii === 0 ? 0 : rand(1, 1024 * 1024),
            cost: ii === 0 ? 0 : Math.round(rand(1, 2)),
            lost: ii === 0 ? 0 : rand(1, 15),
            latency: ii === 0 ? 0 : rand(1, 100),
            time: ii + 1,
          }
        }),
      }
    })
    const id = crypto.randomUUID()
    return {
      id,
      name: `Instance ${i}`,
      ipv4: status ? ipv4 : undefined,
      version: status ? `2.0.0` : undefined,
      hostname: status ? `host-${i}` : undefined,
      config: { str: generateInstanceStrDefault(id), obj: {} },
      natType: [NatType.fullCone, NatType.portRestrictedCone, NatType.restrictedCone, NatType.symmetric, NatType.unknown].splice(Math.floor(rand(0, 3)))[0].toUpperCase(),
      events: [],
      status,
      stats,
    } as InstanceData
  })
}

export function generateInstanceWithDefaultConfig(name?: string) {
  const id = crypto.randomUUID()
  return {
    id,
    name: name ?? `Instance ${generateRandomString(6)}`,
    config: { str: generateInstanceStrDefault(id), obj: {} },
    events: [],
    status: false,
    stats: [],
  } as InstanceData
}

export function generateInstanceWithConfig(config: any) {
  return {
    id: config.id ?? crypto.randomUUID(),
    name: config.instance_name,
    config,
    events: [],
    status: false,
    stats: [],
  } as InstanceData
}

export function generateInstanceStrDefault(id: string) {
  return `
# 实例名称，用于在同一台机器上标识此 VPN 节点
  instance_name = ""
# 主机名，用于标识此设备的主机名
  hostname = ""
# 实例 ID，一般为 UUID，在同一个 VPN 网络中唯一
  instance_id = "${id}"
# 此 VPN 节点的 IPv4 地址，如果为空，则此节点将仅转发数据包，不会创建 TUN 设备
  ipv4 = ""
# 由 Easytier 自动确定并设置IP地址，默认从10.0.0.1开始。警告：在使用 DHCP 时，如果网络中出现 IP 冲突，IP 将自动更改
  dhcp = true

# 监听器列表，用于接受连接
  listeners = [
    "tcp://0.0.0.0:11010",
    "udp://0.0.0.0:11010",
    "wg://0.0.0.0:11011",
    "ws://0.0.0.0:11011",
    "wss://0.0.0.0:11012",
  ]

# 退出节点列表
  exit_nodes = [
  ]

# 用于管理的 RPC 门户地址
  rpc_portal = "127.0.0.1:0"

  [network_identity]
# 网络名称，用于标识 VPN 网络
  network_name = ""
# 网络密钥，用于验证此节点属于 VPN 网络
  network_secret = ""

# 这里是对等连接节点配置，可以多段配置
  [[peer]]
  uri = ""

# 这里是子网代理节点配置，可以有多段配置
  [[proxy_network]]
  cidr = ""

  [flags]
# 连接到对等节点使用的默认协议
  default_protocol = "tcp"
# TUN 设备名称，如果为空，则使用默认名称
  dev_name = ""
# 是否启用加密
  enable_encryption = true
# 是否启用 IPv6 支持
  enable_ipv6 = true
# TUN 设备的 MTU
  mtu = 1380
# 延迟优先模式，将尝试使用最低延迟路径转发流量，默认使用最短路径
  latency_first = false
# 将本节点配置为退出节点
  enable_exit_node = false
# 禁用 TUN 设备
  no_tun = false
# 为子网代理启用 smoltcp 堆栈
  use_smoltcp = false
# 仅转发白名单网络的流量，支持通配符字符串。多个网络名称间可以使用英文空格间隔。如果该参数为空，则禁用转发。默认允许所有网络。例如：'*'（所有网络），'def*'（以def为前缀的网络），'net1 net2'（只允许net1和net2）
  foreign_network_whitelist = "*"
  `
}
