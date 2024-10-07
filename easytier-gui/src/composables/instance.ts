import type { InstanceInstantData } from '~/types/components'

export async function parseNetworkStrConfig(cfg: string) {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<string>('parse_network_config', { cfg })
  }
  else {
    // TODO: web env
  }
}

export async function startNetworkInstance(cfg: string) {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<InstanceInstantData>('run_network_instance', { cfg })
  }
  else {
    // TODO: web env
  }
}

export async function stopNetworkInstance(id: string) {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<null>('stop_network_instance', { id })
  }
  else {
    // TODO: web env
  }
}

export async function easytierVersion() {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<string>('easytier_version')
  }
  else {
    // TODO: web env
  }
}

export async function isAutostart() {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<boolean>('is_autostart')
  }
  else {
    // TODO: web env
  }
}
