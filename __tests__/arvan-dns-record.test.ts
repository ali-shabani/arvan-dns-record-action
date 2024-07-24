import { ArvanDNSRecord } from '../src/arvan-dns-record'

const fetchMock: jest.Mock<Promise<Response>> = jest.fn(
  async () =>
    Promise.resolve({
      ok: true,
      json: async () => Promise.resolve()
    }) as unknown as Response
)
global.fetch = fetchMock

describe('ArvanDNSRecord', () => {
  const domain = 'example.com'
  const apiKey = 'test-api-key'
  const arvanDNSRecord = new ArvanDNSRecord({ domain, apiKey })

  it('should call get with default parameters correctly', async () => {
    await arvanDNSRecord.get()
    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://napi.arvancloud.ir/cdn/4.0/domains/${domain}/dns-records`
    )
  })

  it('should call get with search and type parameters correctly', async () => {
    await arvanDNSRecord.get({ search: 'www', type: 'a' })
    expect(fetchMock.mock.calls[0][0]).toContain(`search=www&type=a`)
  })

  it('should call create correctly', async () => {
    await arvanDNSRecord.create({
      name: 'www',
      type: 'a',
      value: [{ ip: '192.168.1.1' }]
    })

    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://napi.arvancloud.ir/cdn/4.0/domains/${domain}/dns-records`
    )
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: JSON.stringify({
        name: 'www',
        type: 'a',
        value: [{ ip: '192.168.1.1' }]
      })
    })
  })

  it('should call update correctly', async () => {
    const recordId = 'record-id'
    await arvanDNSRecord.update(
      { name: 'www', type: 'a', value: [{ ip: '192.168.1.1' }] },
      recordId
    )

    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://napi.arvancloud.ir/cdn/4.0/domains/${domain}/dns-records/${recordId}`
    )
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'PUT',
      body: JSON.stringify({
        name: 'www',
        type: 'a',
        value: [{ ip: '192.168.1.1' }]
      })
    })
  })
})
