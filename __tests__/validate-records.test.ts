import { validateRecords } from '../src/validate-records'

describe('validateRecords', () => {
  it('validates records with all fields correctly', () => {
    const records = [
      {
        value: { ip: '192.168.1.1' },
        type: 'a',
        name: 'example.com',
        ttl: 300,
        cloud: true,
        upstream_https: 'default',
        ip_filter_mode: {
          count: 'single',
          order: 'none',
          get_filter: 'none'
        }
      }
    ]

    expect(() => validateRecords(records)).not.toThrow()
  })

  it('throws an error for invalid record types', () => {
    const records = [
      {
        value: { ip: '192.168.1.1' },
        type: 'INVALID_TYPE',
        name: 'example.com'
      }
    ]

    expect(() => validateRecords(records)).toThrow()
  })

  it('applies default values for ttl, cloud, and upstream_https', () => {
    const records = [
      {
        value: { ip: '192.168.1.1' },
        type: 'a',
        name: 'example.com'
      }
    ]

    const validatedRecords = validateRecords(records)
    expect(validatedRecords[0].ttl).toBe(120)
    expect(validatedRecords[0].cloud).toBe(false)
    expect(validatedRecords[0].upstream_https).toBe('default')
  })

  it('validates records without ip_filter_mode', () => {
    const records = [
      {
        value: { ip: '192.168.1.1' },
        type: 'a',
        name: 'example.com',
        ttl: 300,
        cloud: true,
        upstream_https: 'default'
      }
    ]

    expect(() => validateRecords(records)).not.toThrow()
  })

  it('throws an error for invalid value types', () => {
    const records = [
      {
        value: 'invalid_value_type',
        type: 'a',
        name: 'example.com'
      }
    ]

    expect(() => validateRecords(records)).toThrow()
  })

  it('throws an error for invalid ip_filter_mode configurations', () => {
    const records = [
      {
        value: { ip: '192.168.1.1' },
        type: 'a',
        name: 'example.com',
        ip_filter_mode: {
          count: 'invalid_count',
          order: 'none',
          get_filter: 'none'
        }
      }
    ]

    expect(() => validateRecords(records)).toThrow()
  })
})
