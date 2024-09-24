import { z } from 'zod'
import type { Config } from '~/components/ui/auto-form/interface'
import type { ZodObjectOrWrapped } from '~/components/ui/auto-form/utils'

export const DEFAULT_CREATE_CONFIG_SCHEMA: ZodObjectOrWrapped = z.object({
  instance_name: z.string().describe('Instance username'),
})

export const DEFAULT_CREATE_FIELD_CONFIG: Config<z.infer<any>> = {
  instance_name: {
    label: '实例名称',
  },
}

export const DEFAULT_CONFIG_SCHEMA: ZodObjectOrWrapped = z.object({
  network_name: z.string().describe('Your username'),
  network_secret: z.string().optional(),
  hostname: z.string().describe('The hostname to use').optional(),
  ipv4: z.string().describe('The IPv4 address to use').ip('v4').optional(),
  dhcp: z.boolean().describe('Whether to enable DHCP').default(false).optional(),
  instance_name: z.string().describe('The name of the instance').optional(),
  listeners: z.array(z.string()).describe('The listeners to use').optional(),
  rpc_portal: z.string().describe('The RPC portal to use').default('127.0.0.1:15888').optional(),
  uri: z.array(z.string()).describe('The URI of the peer').optional(),
  cidr: z.array(z.string()).describe('The CIDR of the proxy network').optional(),
  exit_node: z.array(z.string()).describe('The exit node to use').optional(),
  instance_id: z.string().describe('The ID of the instance').uuid().optional(),

  flags: z.object({
    default_protocol: z.string().describe('The default protocol to use').default('tcp').optional(),
    dev_name: z.string().describe('The name of the device').optional(),
    enable_encryption: z.boolean().describe('Whether to enable encryption').default(true).optional(),
    enable_ipv6: z.boolean().describe('Whether to enable IPv6').default(true).optional(),
    mtu: z.number().describe('The MTU to use').default(1380).optional(),
    latency_first: z.boolean().describe('The latency to use').default(false).optional(),
    enable_exit_node: z.boolean().describe('Whether to enable exit nodes').default(false).optional(),
    no_tun: z.boolean().describe('Whether to disable the TUN interface').default(false).optional(),
    use_smoltcp: z.boolean().describe('Whether to use smoltcp').default(false).optional(),
    foreign_network_whitelist: z.string().describe('A comma-separated list of networks to allow').default('*').optional(),
  }).optional(),
})

export const DEFAULT_FIELD_CONFIG: Config<z.infer<any>> = {
  instance_name: {
    label: '实例名称',
  },
  hostname: {
    label: '主机名',
  },
  instance_id: {
    label: '实例id',
  },
  ipv4: {
    label: 'Ipv4',
  },
  dhcp: {
    label: 'DHCP',
  },
  listeners: {
    label: '监听地址',
  },
  exit_node: {
    label: '出口节点',
  },
  rpc_portal: {
    label: 'RPC端口',
  },
  network_name: {
    label: '组网名称',
  },
  network_secret: {
    label: '组网密码',
  },
}

export const DEFAULT_DEPENDENCIES = {}
