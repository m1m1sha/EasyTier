import _pkg from '~/../package.json'

export const isDev = import.meta.env.DEV

export const isProd = import.meta.env.PROD

export const isTauri = import.meta.env.VITE_TAURI

export const pkg = _pkg
export function humanStreamSize(bytes: number, si = true, dp = 1): string {
  const split = humanStreamSizeSplit(bytes, si, dp)
  return `${split.size ?? ''}${split.unit}`
}

export function humanStreamSizeSplit(bytes: number | undefined, si = true, dp = 1): {
  size: number | undefined
  unit: string
} {
  if (bytes === undefined)
    return { size: undefined, unit: 'N/A' }

  const thresh = si ? 1000 : 1024
  const units = si
    ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  let u = 0

  if (Math.abs(bytes) < thresh) {
    return {
      size: Number(bytes.toFixed(dp)),
      unit: units[u],
    }
  }

  while (Math.abs(bytes) >= thresh && u < units.length - 1) {
    bytes /= thresh
    u++
  }

  return {
    size: Number(bytes.toFixed(dp)),
    unit: units[u],
  }
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
