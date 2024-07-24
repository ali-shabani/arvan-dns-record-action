import * as core from '@actions/core'
import path from 'path'
import { readFile } from 'fs/promises'
import { RecordSchema, validateRecords } from './validate-records'

export type GetInputReturn = {
  apiKey: string
  domain: string
  records: RecordSchema
}

export async function getInput(): Promise<GetInputReturn> {
  const apiKey = core.getInput('api_key')
  const domain = core.getInput('domain')
  const file = core.getInput('file')

  const workingDirectory = process.env.GITHUB_WORKSPACE

  if (!workingDirectory) {
    throw new Error('GITHUB_WORKSPACE not defined.')
  }

  const records = validateRecords(
    JSON.parse(
      await readFile(path.resolve(workingDirectory, file), {
        encoding: 'utf8'
      })
    )
  )

  return {
    apiKey,
    domain,
    records
  }
}
