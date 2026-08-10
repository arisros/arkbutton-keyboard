/** Generate the Cosmos board (microcontroller) holder for the right side. */
import { writeFileSync } from 'fs'
import { getSTL } from '$lib/worker/api'
import { setup } from './node-model'
import config from './userconfig'

await setup()
const conf = (config as any).right
try {
  const blob = await getSTL(conf, 'holder', 'right', true)
  const buf = Buffer.from(await blob.arrayBuffer())
  writeFileSync('/Users/arisjirat/keyboard-project/cosmos/holder.stl', buf)
  console.log('OK holder.stl', buf.length, 'bytes')
} catch (e) {
  console.error('FAIL', (e as Error).message)
}
