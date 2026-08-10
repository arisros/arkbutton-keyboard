/** Split the case into:
 *   - case_main.stl  : the bowl with a CLEAN rectangular notch (coakan) at the
 *                      back I/O area. Printed ONCE; never reprinted on MCU swap.
 *   - case_chunk.stl : the removable I/O block (potongan) that plugs into the
 *                      notch. Carries the connector openings; later merged with
 *                      the MCU holder + reset button (see block.scad). Reprint
 *                      this when the microcontroller / connector layout changes.
 *
 * Both parts are anchored to the bottom plate (cosmotyl-plateright) which spans
 * the full footprint, so the block bolts DOWN into the plate independently of
 * the bowl. Run:  bun src/model_gen/gen-split.ts
 */
import { writeFileSync } from 'fs'
import { makeBaseBox, makeCylinder } from 'replicad'
import { generate } from '$lib/worker/api'
import { boardHolder } from '$lib/worker/model'
import { newGeometry } from '$lib/worker/config'
import { Assembly } from '$lib/worker/modeling/assembly'
import { blobSTL, combine } from '$lib/worker/modeling/index'
import Trsf from '$lib/worker/modeling/transformation'
import { setup } from './node-model'
import config from './userconfig'

const OUT = '/Users/arisjirat/keyboard-project/cosmos'
const write = async (name: string, shape: any) => {
  const buf = Buffer.from(await blobSTL(shape, { tolerance: 1e-2, angularTolerance: 1 }).arrayBuffer())
  writeFileSync(`${OUT}/${name}`, buf)
  console.log('OK', name, buf.length)
}

// --- Coakan box B (case STL frame, z=0 at floor) --------------------------
// Covers the back I/O region. Connector openings live at X -4..21, Z 3..11
// (measured from the old chunk), at the back wall (Y ~95..101).
// Ground truth from Cosmos geometry: connectorOrigin = (x=-14, y=92.8, z=3).
// Box centers on it, covering the back connector-wall section (the MCU holder
// is already a separate bottom-mounted part, so the block is just this wall).
const BX0 = -37, BX1 = 7    // X span (width 44, centered on connectorOrigin x=-15)
const BY0 = 72, BY1 = 106   // Y span  (deep: connector sockets reach inward to ~y73)
const BZ0 = -2, BZ1 = 26    // Z span  (height 28, floor up over connectors)
const W = BX1 - BX0, D = BY1 - BY0, H = BZ1 - BZ0
// Export box params so block.scad reuses the exact same volume.
writeFileSync(`${OUT}/_split_box.json`, JSON.stringify({ BX0, BX1, BY0, BY1, BZ0, BZ1 }, null, 2))

await setup()
const confFull = (config as any).right

// IMPORTANT: cutWithConnector() leaves degenerate wall geometry around the
// connector opening, which makes OpenCascade's boolean cut() silently skip that
// region (the connector wall survives even a huge cutting box). So the bowl is
// generated WITHOUT connectors -> clean back wall -> reliable window cut. The
// removable block carries the connector openings instead (built in block.scad).
const confClean = { ...confFull, connectors: [], connectorIndex: -1 }

const geoClean = newGeometry(confClean)
let { assembly } = await generate(confClean, geoClean, true, false)
assembly = assembly.transform(new Trsf().translate(0, 0, -geoClean.floorZ)) // match STL frame
// At the low/flat geometry the auto-placed "Screw Attachments" generate DEGENERATE
// geometry (bbox blows up to X -149..182), which makes OpenCascade booleans return
// garbage. Build the boolean case from the clean parts only (walls/web/holders) —
// the back wall we need lives in "Walls".
const goodParts = (assembly as any).parts.filter((p: any) => p.name !== 'Screw Attachments')
const cleanCase: any = combine(goodParts.map((p: any) => p.shape))
await write('clean_case.stl', cleanCase)   // uncut clean bowl, for the manifold mesh-boolean split

// makeBaseBox: CENTERED in X,Y; CORNER (0..H) in Z. Built after a case solid.
const box = makeBaseBox(W, D, H).translate((BX0 + BX1) / 2, (BY0 + BY1) / 2, BZ0)

// --- connector openings through the back panel (bored along +Y, out the back) -
// FIRST-PASS positions [x,z] + sizes — validate/adjust in the viewer.
const TRRS = [-28, 7], USB = [-7, 7], RESET = [-30, 20]   // tracked to connectorOrigin -15; reset raised clear of TRRS
const TRRS_D = 12.0          // round jack hole Ø
const USB_W = 13.0, USB_H = 6.0   // USB-C slot W x H
const RESET_D = 7.0          // reset button hole Ø
const cyl = (d: number, x: number, z: number) => makeCylinder(d / 2, 40, [x, 76, z], [0, 1, 0])
const slot = (w: number, h: number, x: number, z: number) => makeBaseBox(w, 40, h).translate(x, 96, z - h / 2)
const bore = (s: any) => s.cut(cyl(TRRS_D, TRRS[0], TRRS[1]))
  .cut(slot(USB_W, USB_H, USB[0], USB[1]))
  .cut(cyl(RESET_D, RESET[0], RESET[1]))

try {
  await write('case_main.stl', cleanCase.clone().cut(box))        // clean bowl with notch
} catch (e) {
  console.error('MAIN CUT FAILED:', (e as Error).message)
}

// --- Unified I/O block = wall panel (closes window) + RP2040-Zero holder + reset
// boss, FUSED into ONE solid, with the connector holes bored through. Reprint
// THIS single part (not the bowl) when the microcontroller / connectors change.
try {
  // The wall panel is an OPEN shell (the bowl wall), so a boolean fuse with the
  // holder is unreliable. Instead group panel + holder + reset boss into a
  // COMPOUND (one STL, parts touching = one printable part) — no fragile fuse.
  // Holes are cut from the panel alone (cutting the shell IS reliable).
  const panel: any = bore(cleanCase.clone().intersect(box))   // flush wall + connector holes
  const holder: any = boardHolder(confFull, newGeometry(confFull)).translateZ(-geoClean.floorZ)
  // reset tactile-switch boss (behind the panel) — a post up to the raised reset
  // height, with a 6.6 mm switch pocket facing the panel (+Y).
  const resetBoss: any = makeBaseBox(11, 10, RESET[1] + 4).translate(RESET[0], 86, 0)
    .cut(makeBaseBox(6.6, 6.6, 8).translate(RESET[0], 88, RESET[1] - 4))
  const block = new Assembly()
  block.add('panel', panel)
  block.add('holder', holder)
  block.add('reset', resetBoss)
  await write('block.stl', block)
} catch (e) {
  console.error('BLOCK BUILD FAILED:', (e as Error).message)
}
console.log('done')
