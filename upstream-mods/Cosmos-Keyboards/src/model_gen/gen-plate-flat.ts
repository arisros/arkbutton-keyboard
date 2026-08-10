/** Generate a NON-rounded plate, used only as a clean footprint for the stand. */
import { writeFileSync } from 'fs'
import { getSTL } from '$lib/worker/api'
import { setup } from './node-model'
import config from './userconfig'

await setup()
const conf = (config as any).right
conf.rounded = {} // disable rounding so projection() in the stand stays clean
const blob = await getSTL(conf, 'plate', 'right', true)
const buf = Buffer.from(await blob.arrayBuffer())
writeFileSync('/Users/arisjirat/keyboard-project/cosmos/plate_flat.stl', buf)
console.log('OK plate_flat.stl', buf.length, 'bytes')
