export enum InstanceStatus {
  starting = 'starting',
  online = 'online',
  offline = 'offline',
  error = 'error',
}

export enum NatType {
  unknown = 'unknown',
  symmetric = 'symmetric',
  fullCone = 'full cone',
  restrictedCone = 'restricted cone',
  portRestrictedCone = 'port restricted cone',
}

export interface InstanceData {
  id: string
  name: string
  ipv4?: string
  version?: string
  hostname?: string
  natType?: string
  config: InstanceConfig
  events: string[]
  status: boolean
  stats: InstanceTimePeer[]
}

export interface InstanceConfig {
  str: string
  obj: {
    [key: string]: any
  }
}

export interface InstancePeer {
  id: string
  name: string
  ipv4?: string
  ipv6?: string
  version?: string
  up: number
  down: number
  cost: number
  lost: number
  latency: number
}

export interface InstancePeerDetail {
  id: string
  name: string
  version?: string
  stats: InstancePeerStat[]
}

export interface InstancePeerStat {
  time: number
  ipv4: string | undefined
  ipv6: string | undefined
  up: number
  down: number
  cost: number
  lost: number
  latency: number
}

export interface InstanceTimePeer {
  time: number
  peers: InstancePeer[]
}

export interface InstanceChartStat {
  time: number
  total: number
  up: number
  down: number
  lost: number
}

export enum TransitionFunc {
  linear = 'linear',
  easeOutSine = 'easeOutSine',
  easeInOutSine = 'easeInOutSine',
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInCubic = 'easeInCubic',
  easeOutCubic = 'easeOutCubic',
  easeInOutCubic = 'easeInOutCubic',
  easeInQuart = 'easeInQuart',
  easeOutQuart = 'easeOutQuart',
  easeInOutQuart = 'easeInOutQuart',
  easeInQuint = 'easeInQuint',
  easeOutQuint = 'easeOutQuint',
  easeInOutQuint = 'easeInOutQuint',
  easeInExpo = 'easeInExpo',
  easeOutExpo = 'easeOutExpo',
  easeInOutExpo = 'easeInOutExpo',
  easeInCirc = 'easeInCirc',
  easeOutCirc = 'easeOutCirc',
  easeInOutCirc = 'easeInOutCirc',
  easeInBack = 'easeInBack',
  easeOutBack = 'easeOutBack',
  easeInOutBack = 'easeInOutBack',
}
