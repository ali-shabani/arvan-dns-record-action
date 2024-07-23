import { RecordType } from './constants'
import {
  CreateDNSRecordsResponse,
  CreateUpdateRecordArgs,
  GetDNSRecordsResponse,
  UpdateDNSRecordsResponse
} from './types'
import { createQueryParams } from './utils/create-query-params'

export type ArvanDNSRecordOptions = {
  domain: string
  apiKey: string
}

export type GetArgs = {
  search?: string
  type?: RecordType
}

export class ArvanDNSRecord {
  private endpoint = 'https://napi.arvancloud.ir/cdn/4.0/domains'
  private domain: string
  private apiKey: string

  constructor({ domain, apiKey }: ArvanDNSRecordOptions) {
    this.domain = domain
    this.apiKey = apiKey
  }

  async get(args: GetArgs = {}): Promise<GetDNSRecordsResponse> {
    const queryParams = createQueryParams(args)
    return this.request<GetDNSRecordsResponse>(
      {},
      queryParams ? `?${queryParams}` : ''
    )
  }

  async create(
    args: CreateUpdateRecordArgs
  ): Promise<CreateDNSRecordsResponse> {
    return this.request<CreateDNSRecordsResponse>({
      method: 'POST',
      body: JSON.stringify(args)
    })
  }

  async update(
    args: CreateUpdateRecordArgs,
    record: string
  ): Promise<UpdateDNSRecordsResponse> {
    return this.request<UpdateDNSRecordsResponse>(
      {
        method: 'PUT',
        body: JSON.stringify(args)
      },
      `/${record}`
    )
  }

  private async request<TResponse = unknown>(
    { headers, ...init }: RequestInit = {},
    resource?: string
  ): Promise<TResponse> {
    const response = await fetch(
      `${this.endpoint}/${this.domain}/dns-records${resource ?? ''}`,
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Authorization: this.apiKey
        },
        ...init
      }
    )

    if (response.ok) {
      return response.json()
    }

    throw response
  }
}
