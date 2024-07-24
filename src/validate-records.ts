import z from 'zod'
import { RECORD_TYPES, UPSTREAM_HTTPS } from './constants'

const recordSchema = z.array(
  z.object({
    value: z.union([z.record(z.any()), z.array(z.any())]),
    type: z.enum(RECORD_TYPES),
    name: z.string(),
    ttl: z.coerce.number().default(120),
    cloud: z.boolean().optional().default(false),
    upstream_https: z.enum(UPSTREAM_HTTPS).default('default'),
    ip_filter_mode: z
      .object({
        count: z.enum(['single', 'multi']),
        order: z.enum(['none', 'weighted', 'rr']).default('none'),
        get_filter: z.enum(['none', 'location', 'country']).default('none')
      })
      .optional()
  })
)

export type RecordSchema = z.infer<typeof recordSchema>

export function validateRecords(data: unknown): RecordSchema {
  return recordSchema.parse(data)
}
