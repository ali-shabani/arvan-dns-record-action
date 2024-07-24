export const RECORD_TYPES = [
  'a',
  'aaaa',
  'ns',
  'txt',
  'cname',
  'aname',
  'mx',
  'srv',
  'spf',
  'dkim',
  'ptr',
  'tlsa',
  'caa'
] as const

export const UPSTREAM_HTTPS = ['default', 'auto', 'http', 'https'] as const

export type RecordType = (typeof RECORD_TYPES)[number]
export type UpstreamHTTPS = (typeof UPSTREAM_HTTPS)[number]
