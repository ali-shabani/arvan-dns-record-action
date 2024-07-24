/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as input from '../src/get-input'

import { run } from '../src/main'
import * as core from '@actions/core'
import { ArvanDNSRecord } from '../src/arvan-dns-record'

// Mock the GitHub Actions core library
let infoMock: jest.SpiedFunction<typeof core.info>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>

let getInputMock: jest.SpiedFunction<typeof input.getInput>

const arvanGetMock = jest.fn()
const arvanCreateMock = jest.fn()
const arvanUpdateMock = jest.fn()

const testRecord = {
  name: 'test',
  type: 'a' as const,
  value: { ip: '192.168.1.1' },
  ttl: 120,
  cloud: false,
  upstream_https: 'auto' as const
}

jest.mock('../src/arvan-dns-record')

describe('run function', () => {
  const mockArvanDNSRecord = ArvanDNSRecord as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    infoMock = jest.spyOn(core, 'info').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

    getInputMock = jest.spyOn(input, 'getInput').mockImplementation(async () =>
      Promise.resolve({
        apiKey: 'test-api-key',
        domain: 'example.com',
        records: [testRecord]
      })
    )

    getInputMock.mockResolvedValue({
      apiKey: 'test-api-key',
      domain: 'example.com',
      records: [testRecord]
    })

    mockArvanDNSRecord.mockImplementation(() => ({
      get: arvanGetMock,
      create: arvanCreateMock,
      update: arvanUpdateMock
    }))
  })

  it('skip existing records successfully', async () => {
    arvanGetMock.mockResolvedValue({
      data: [{ name: 'test', id: '123', value: { ip: '192.168.1.1' } }]
    })
    arvanUpdateMock.mockReturnValueOnce(Promise.resolve())

    await run()

    expect(infoMock).toHaveBeenCalledWith(
      'skipped record test (already up to date)'
    )
  })

  it('updates existing records successfully', async () => {
    arvanGetMock.mockResolvedValue({
      data: [{ name: 'test', id: '123' }]
    })
    arvanUpdateMock.mockReturnValueOnce(Promise.resolve())

    await run()

    expect(arvanUpdateMock).toHaveBeenCalledWith(testRecord, '123')
    expect(infoMock).toHaveBeenCalledWith('updated record test')
  })

  it('creates new records successfully', async () => {
    arvanGetMock.mockResolvedValue({ data: [] })
    arvanCreateMock.mockReturnValueOnce(Promise.resolve())
    await run()

    expect(arvanCreateMock).toHaveBeenCalledWith(testRecord)
    expect(infoMock).toHaveBeenCalledWith('created record test')
  })

  it('handles API errors during record update', async () => {
    arvanGetMock.mockRejectedValueOnce(new Error('API ERROR'))

    await run()

    expect(setFailedMock).toHaveBeenCalledWith('API ERROR')
  })

  it('handles unexpected errors', async () => {
    getInputMock.mockRejectedValue(new Error('Unexpected error'))

    await run()

    expect(setFailedMock).toHaveBeenCalledWith('Unexpected error')
  })
})
