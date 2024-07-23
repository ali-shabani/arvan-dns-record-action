import * as core from '@actions/core'
import { getInput } from './get-input'
import { ArvanDNSRecord } from './arvan-dns-record'
import { isEqual } from 'lodash'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { apiKey, domain, records } = await getInput()

    const restApi = new ArvanDNSRecord({ apiKey, domain })

    for (const record of records) {
      const response = await restApi.get({
        search: record.name,
        type: record.type
      })

      const found = response.data.find(item => item.name === record.name)

      if (found) {
        if (isEqual(found.value, record.value)) {
          core.info(`skipped record ${record.name} (already up to date)`)
          continue
        }

        await restApi.update(record, found.id)
        core.info(`updated record ${record.name}`)
      } else {
        await restApi.create(record)
        core.info(`created record ${record.name}`)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
    if (error instanceof Response)
      core.setFailed(`request failed with status ${error.status}`)
  }
}
