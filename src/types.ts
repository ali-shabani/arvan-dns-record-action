import { UpstreamHTTPS, RecordType } from './constants'

export type CreateUpdateRecordArgs = {
  name: string
  type: RecordType
  value: unknown
  ttl?: number
  upstream_https?: UpstreamHTTPS
  cloud?: boolean
}

export type RecordResponse = {
  id: string
  name: string
  type: RecordType
  value: unknown
  ttl: number
  upstream_https: UpstreamHTTPS
  cloud: boolean
  created_at: string
  updated_at: string
}

export type Links = {
  first: string
  last: string
  prev: string
  next: string
}

export type Meta = {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}

export type GetDNSRecordsResponse = {
  data: RecordResponse[]
  link: Links
  meta: Meta
}

export type CreateDNSRecordsResponse = {
  data: unknown
  message: string
}

export type UpdateDNSRecordsResponse = {
  data: unknown
  message: string
}
