/** Dump connector (USB/TRRS) + microcontroller position for the cover-mounted holder. */
import { newGeometry } from '$lib/worker/config'
import { setup } from './node-model'
import config from './userconfig'

await setup()
const conf = (config as any).right
const geo = newGeometry(conf)
const floorZ = geo.floorZ
const co: any = (geo as any).connectorOrigin
console.log('floorZ =', floorZ)
console.log('connectors config =', JSON.stringify(conf.connectors))
console.log('microcontroller =', conf.microcontroller, 'angle =', conf.microcontrollerAngle)
if (co) {
  const o = co.origin()
  console.log('connectorOrigin (raw) =', [o.x, o.y, o.z])
  console.log('connectorOrigin (case STL frame, z-floorZ) =', [o.x, o.y, o.z - floorZ])
} else console.log('connectorOrigin = none')
