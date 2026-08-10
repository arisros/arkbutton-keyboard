/** Headless STL export of a Cosmos expert config (the case is non-pro). */
import { writeFileSync } from 'fs'
import { getSTL } from '$lib/worker/api'
import { setup } from './node-model'
import config from './userconfig'

const OUT = '/Users/arisjirat/keyboard-project/cosmos'

await setup()
const conf = (config as any).right   // expert Options object == Cuttleform

const jobs: Array<[string, string]> = [
  ['model', 'cosmotyl-caseright.stl'],
  ['plate', 'cosmotyl-plateright.stl'],
]
for (const [name, file] of jobs) {
  try {
    const blob = await getSTL(conf, name, 'right', true)
    const buf = Buffer.from(await blob.arrayBuffer())
    writeFileSync(`${OUT}/${file}`, buf)
    console.log('OK', file, buf.length, 'bytes')
  } catch (e) {
    console.error('FAIL', name, (e as Error).stack)
  }
}
console.log('done')
