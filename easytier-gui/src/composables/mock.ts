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
      config: { str: generateInstanceStrDefault(), obj: {} },
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
    config: { str: generateInstanceStrDefault(), obj: {} },
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

export function generateInstanceStrDefault(name: string = 'instance-default') {
  return `
instance_name = "${name}"
dhcp = true
listeners = [
    "tcp://0.0.0.0:11010",
    "udp://0.0.0.0:11010",
    "wg://0.0.0.0:11011",
]
rpc_portal = "127.0.0.1:0"

[network_identity]
network_name = "easytier-default"
network_secret = ""

[[peer]]
uri = "tcp://easytier.public.kkrainbow.top:11010"
  `
}
