/** Export home-key positions (thumb/index/middle/ring/pinky) for viewer labels. */
import { writeFileSync } from 'fs'
import { newGeometry } from '$lib/worker/config'
import { setup } from './node-model'
import config from './userconfig'

await setup()
const conf = (config as any).right
const geo = newGeometry(conf)
const trsfs = geo.keyHolesTrsfs.flat()
const floorZ = geo.floorZ

const labels: Array<{ home: string; pos: [number, number, number] }> = []
conf.keys.forEach((k: any, i: number) => {
  const home = k.keycap?.home
  if (home && trsfs[i]) {
    const o = trsfs[i].origin()
    labels.push({ home, pos: [o.x, o.y, o.z - floorZ] })
  }
})
writeFileSync('/Users/arisjirat/keyboard-project/cosmos/labels.json', JSON.stringify(labels, null, 1))
console.log('OK labels.json', labels.map(l => l.home).join(', '))
