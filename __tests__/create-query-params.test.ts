import { createQueryParams } from '../src/utils/create-query-params'

describe('createQueryParams', () => {
  it('should return an empty string for an empty object', () => {
    expect(createQueryParams({})).toBe('')
  })

  it('should handle a single key-value pair', () => {
    expect(createQueryParams({ key: 'value' })).toBe('key=value')
  })

  it('should join multiple key-value pairs with "&"', () => {
    expect(createQueryParams({ key1: 'value1', key2: 'value2' })).toBe(
      'key1=value1&key2=value2'
    )
  })

  it('should encode special characters in keys and values', () => {
    expect(
      createQueryParams({ 'key one': 'value one', 'key&two': 'value/two' })
    ).toBe('key%20one=value%20one&key%26two=value%2Ftwo')
  })

  it('should handle numeric values', () => {
    expect(createQueryParams({ page: 1, size: 20 })).toBe('page=1&size=20')
  })
})
