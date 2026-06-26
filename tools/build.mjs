/** Build orchestrator — regenerates only what a change needs (dependency graph).
 *   node tools/build.mjs <target ...>
 * targets: block case holder plate stand labels fullcase all
 *   block    = mesh-split.mjs only
 *   case     = gen-split.ts -> mesh-split.mjs
 *   holder   = gen-holder.ts
 *   plate    = gen-plate-flat.ts -> re-export stand (stand imports plate_flat)
 *   stand    = OpenSCAD export bottom+top
 *   labels   = gen-labels.ts
 *   fullcase = gen-stl.ts (cosmotyl-caseright + plate)
 *   all      = gen-split + gen-holder -> mesh-split -> gen-plate-flat -> stand -> labels
 */
import { spawnSync } from 'child_process'
import { homedir } from 'os'

const CK = new URL('../Cosmos-Keyboards/', import.meta.url).pathname
const STAND = new URL('../dactyl-manuform-keyboard/cosmos/', import.meta.url).pathname
const OSC = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
const OUT = new URL('../cosmos/', import.meta.url).pathname
const bunEnv = { ...process.env, PATH: `/opt/homebrew/opt/openjdk/bin:${homedir()}/bin:${process.env.PATH}` }
const scadEnv = { ...process.env, OPENSCADPATH: `${homedir()}/Documents/OpenSCAD/libraries` }

const STEPS = {
  genSplit:     ['bun', ['src/model_gen/gen-split.ts'], CK, bunEnv],
  meshSplit:    ['node', ['src/model_gen/mesh-split.mjs'], CK, bunEnv],
  genHolder:    ['bun', ['src/model_gen/gen-holder.ts'], CK, bunEnv],
  genPlateFlat: ['bun', ['src/model_gen/gen-plate-flat.ts'], CK, bunEnv],
  genLabels:    ['bun', ['src/model_gen/gen-labels.ts'], CK, bunEnv],
  genStl:       ['bun', ['src/model_gen/gen-stl.ts'], CK, bunEnv],
  standBottom:  [OSC, ['-o', `${OUT}stand_bottom.stl`, '-D', 'part="bottom"', `${STAND}export_stand.scad`], STAND, scadEnv],
  standTop:     [OSC, ['-o', `${OUT}stand_top.stl`, '-D', 'part="top"', `${STAND}export_stand.scad`], STAND, scadEnv],
  standDeployed:[OSC, ['-o', `${OUT}stand_deployed.stl`, '-D', 'part="deployed"', `${STAND}export_stand.scad`], STAND, scadEnv],
  standLeg:     [OSC, ['-o', `${OUT}stand_leg.stl`, '-D', 'part="leg"', `${STAND}export_stand.scad`], STAND, scadEnv],
  standFolded:  [OSC, ['-o', `${OUT}stand_folded.stl`, '-D', 'part="folded"', `${STAND}export_stand.scad`], STAND, scadEnv],
}
const TARGETS = {
  block: ['meshSplit'],
  case: ['genSplit', 'meshSplit'],
  holder: ['genHolder'],
  plate: ['genPlateFlat', 'standBottom', 'standTop', 'standDeployed'],
  stand: ['standBottom', 'standTop', 'standDeployed', 'standLeg', 'standFolded'],
  labels: ['genLabels'],
  fullcase: ['genStl'],
  all: ['genSplit', 'genHolder', 'meshSplit', 'genPlateFlat', 'standBottom', 'standTop', 'genLabels'],
}

function run(name) {
  const [cmd, args, cwd, env] = STEPS[name]
  const t0 = Date.now()
  process.stdout.write(`  → ${name} … `)
  const r = spawnSync(cmd, args, { cwd, env, encoding: 'utf8' })
  const dt = ((Date.now() - t0) / 1000).toFixed(1)
  if (r.status !== 0) {
    console.log(`\x1b[31mFAIL\x1b[0m (${dt}s)`)
    console.log((r.stderr || r.stdout || '').split('\n').slice(-12).join('\n'))
    return false
  }
  console.log(`\x1b[32mok\x1b[0m (${dt}s)`)
  return true
}

const wanted = process.argv.slice(2)
if (!wanted.length || wanted.some(t => !TARGETS[t])) {
  console.error('usage: node tools/build.mjs <' + Object.keys(TARGETS).join('|') + '> ...'); process.exit(2)
}
// dedupe steps preserving order
const seen = new Set(), steps = []
for (const t of wanted) for (const s of TARGETS[t]) if (!seen.has(s)) { seen.add(s); steps.push(s) }
console.log('build:', wanted.join(' '), '→ steps:', steps.join(', '))
let ok = true
for (const s of steps) { if (!run(s)) { ok = false; break } }
console.log(ok ? '\x1b[32mbuild ok\x1b[0m' : '\x1b[31mbuild failed\x1b[0m')
process.exit(ok ? 0 : 1)
