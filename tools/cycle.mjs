/** One-command dev cycle: build(target) -> validate -> capture -> summary.
 * The develop→test→feedback step of the loop. Validate still runs even if build
 * fails, and capture still runs even if validate fails (so you SEE the breakage).
 *   node tools/cycle.mjs [target]      (default target: all)
 */
import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { get } from 'http'

const T = new URL('.', import.meta.url).pathname
const target = process.argv[2] || 'all'
// which capture sets matter for this target
const SETS = {
  block: ['case', 'io', 'thumb', 'assembly'], case: ['case', 'io', 'thumb', 'assembly'],
  holder: ['case', 'io'], plate: ['stand', 'deployed', 'lock', 'fit', 'hinge'], stand: ['stand', 'deployed', 'lock', 'fit', 'hinge'],
  labels: [], fullcase: ['case'], all: [],
}[target] ?? []

const node = (script, args = []) => spawnSync('node', [T + script, ...args], { stdio: 'inherit' })

console.log(`\x1b[1m━━ cycle: ${target} ━━\x1b[0m`)
console.log('\x1b[1m[1/3] build\x1b[0m')
const b = node('build.mjs', [target])
console.log('\x1b[1m[2/3] validate\x1b[0m')
const v = node('validate.mjs')
console.log('\x1b[1m[3/3] capture\x1b[0m')
const c = node('capture.mjs', SETS)

// viewer reachability
const viewerUp = await new Promise(r => {
  const req = get('http://localhost:8011/viewer.html', res => { r(res.statusCode === 200); res.resume() })
  req.on('error', () => r(false)); req.setTimeout(800, () => { req.destroy(); r(false) })
})

let nFails = 0
try { nFails = JSON.parse(readFileSync(T + 'validate-report.json')).fails } catch {}
console.log('\n\x1b[1m━━ summary ━━\x1b[0m')
console.log(`  build:    ${b.status === 0 ? '\x1b[32mok\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}`)
console.log(`  validate: ${nFails === 0 ? '\x1b[32mall pass\x1b[0m' : `\x1b[31m${nFails} FAIL\x1b[0m`}  (tools/validate-report.json)`)
console.log(`  capture:  ${c.status === 0 ? '\x1b[32mok\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}  (tools/captures/*.png)`)
console.log(`  viewer:   ${viewerUp ? '\x1b[32mhttp://localhost:8011/viewer.html\x1b[0m' : '\x1b[33mnot running — `cd cosmos && python3 -m http.server 8011`\x1b[0m'}`)
process.exit(b.status === 0 && nFails === 0 ? 0 : 1)
