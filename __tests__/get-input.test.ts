import * as core from '@actions/core'
import fs from 'fs/promises'
import { getInput } from '../src/get-input'

describe('getInput function', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(core, 'getInput').mockImplementation(name => {
      switch (name) {
        case 'file':
          return 'files/records.json'
        case 'api_key':
          return 'test_api_key'
        case 'domain':
          return 'test.com'
        default:
          return ''
      }
    })
  })

  test('throw new error if GITHUB_WORKSPACE is not defined', async () => {
    process.env.GITHUB_WORKSPACE = ''
    await expect(getInput()).rejects.toThrow('GITHUB_WORKSPACE not defined.')
  })

  test('should correctly parse input from action and file', async () => {
    process.env.GITHUB_WORKSPACE = __dirname
    const result = await getInput()

    expect(core.getInput).toHaveBeenCalledWith('api_key')
    expect(core.getInput).toHaveBeenCalledWith('domain')
    expect(core.getInput).toHaveBeenCalledWith('file')

    expect(result).toEqual({
      apiKey: 'test_api_key',
      domain: 'test.com',
      records: [
        {
          name: 'test',
          type: 'a',
          value: [{ ip: '127.0.0.1' }],
          cloud: false,
          ttl: 120,
          upstream_https: 'default'
        }
      ]
    })
  })

  test('should handle invalid JSON in file', async () => {
    jest
      .spyOn(fs, 'readFile')
      .mockReturnValueOnce(Promise.resolve('this is a text not json'))
    await expect(getInput()).rejects.toThrow()
  })
})
