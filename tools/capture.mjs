/** Headless multi-view capture of the project STLs via three.js (Playwright).
 * Reliable named cameras (top/front/right/left/iso/back) — replaces the
 * unreliable OpenSCAD CLI gimbal. Writes tools/captures/<set>-<view>.png.
 *   node tools/capture.mjs [set ...]      (default: all sets)
 */
import { createServer } from 'http'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { extname, join } from 'path'

const ROOT = new URL('..', import.meta.url).pathname        // ~/keyboard-project
const OUT = new URL('./captures/', import.meta.url).pathname
const PW = new URL('../Cosmos-Keyboards/node_modules/playwright/index.js', import.meta.url).href
const PORT = 8788

const SETS = {
  assembly: { parts: [['cosmos/case_main.stl', 'gray'], ['cosmos/block.stl', 'orange'], ['cosmos/stand_bottom.stl', 'green'], ['cosmos/stand_top.stl', 'yellow']], views: ['iso', 'front', 'right'] },
  case:     { parts: [['cosmos/case_main.stl', 'gray'], ['cosmos/block.stl', 'orange']], views: ['iso', 'back', 'front', 'right', 'top'] },
  stand:    { parts: [['cosmos/stand_bottom.stl', 'green'], ['cosmos/stand_top.stl', 'yellow']], views: ['iso', 'top', 'right', 'front'] },
  deployed: { parts: [['cosmos/stand_deployed.stl', 'green']], views: ['right', 'front', 'iso'] },
  folded:   { parts: [['cosmos/stand_folded.stl', 'green']], views: ['right', 'front', 'iso'] },
  lock:     { parts: [['cosmos/stand_bottom.stl', 'green'], ['cosmos/stand_leg.stl', 'orange']], focus: { center: [-35, 24, 4], r: 30 }, views: ['front', 'right', 'iso'] },
  fit:      { parts: [['cosmos/case_main.stl', 'gray', 0.45], ['cosmos/stand_top.stl', 'yellow']], views: ['top'] },
  hinge:    { parts: [['cosmos/stand_bottom.stl', 'green'], ['cosmos/stand_top.stl', 'yellow']], focus: { center: [83, 34, 5], r: 26 }, views: ['iso', 'front', 'top'] },
  io:       { parts: [['cosmos/case_main.stl', 'gray'], ['cosmos/block.stl', 'orange']], focus: { center: [-14, 90, 8], r: 32 }, views: ['back'] },
  thumb:    { parts: [['cosmos/case_main.stl', 'gray']], focus: { center: [-30, -15, 18], r: 42 }, views: ['iso', 'top', 'front', 'right', 'back'] },
  socket:   { parts: [['cosmos/case_main.stl', 'gray']], focus: { center: [5.9, 38.4, 18.5], r: 10 }, views: ['top', 'bottom', 'iso'] },
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.stl': 'application/octet-stream', '.png': 'image/png' }
const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(req.url.split('?')[0])
    const fp = p === '/' ? join(ROOT, 'tools/capture.html') : join(ROOT, p.replace(/^\//, ''))
    const body = await readFile(fp)
    res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); res.end(body)
  } catch { res.writeHead(404); res.end('404') }
})

// live-viewer shots: [name, {slot, eye, target}] — captures the actual viewer.html
// (keyboard on the tilted bottom cover, prop leg, desk grid) headlessly.
// key cluster is centred on the world origin, so target the origin to frame it
const VIEWER_SHOTS = [
  ['deployed',  { slot: 3, eye: [170, -250, 150], target: [0, 0, 25] }],
  ['front',     { slot: 3, eye: [0, -320, 70], target: [0, 0, 25] }],
  ['side',      { slot: 3, eye: [360, -10, 80], target: [0, 0, 25] }],
  ['low',       { slot: 3, eye: [120, -280, 40], target: [0, 0, 15] }],
  ['flat',      { slot: 0, eye: [150, -250, 190], target: [0, 0, 15] }],
  ['top',       { slot: 3, eye: [0, 0, 420], target: [0, 0, 5] }],
  ['pivot',     { slot: 2, eye: [22, -70, 20], target: [0, 0, 31] }],
]

async function captureViewer(page) {
  await page.goto(`http://localhost:${PORT}/cosmos/viewer.html`, { waitUntil: 'load' })
  await page.waitForFunction('window.__ready === true', { timeout: 20000 })
  const written = []
  for (const [name, opts] of VIEWER_SHOTS) {
    const dataURL = await page.evaluate(o => window.__cap(o), { ...opts, size: [1100, 800] })
    const file = join(OUT, `viewer-${name}.png`)
    await writeFile(file, Buffer.from(dataURL.split(',')[1], 'base64'))
    written.push(`captures/viewer-${name}.png`)
  }
  return written
}

async function main() {
  const args = process.argv.slice(2)
  const wantViewer = args.includes('viewer')
  const which = args.filter(s => SETS[s])
  const sets = which.length ? which : (wantViewer ? [] : Object.keys(SETS))
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true })
  await new Promise(r => server.listen(PORT, r))
  const pw = await import(PW)
  const chromium = pw.chromium || pw.default?.chromium
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
  const page = await browser.newPage()
  page.on('pageerror', e => console.error('PAGE ERROR', e.message))
  const written = []
  for (const name of sets) {
    const s = SETS[name]
    const spec = { W: 1000, H: 750, parts: s.parts.map(([file, color, opacity]) => ({ file: '/' + file, color, opacity })) }
    await page.goto(`http://localhost:${PORT}/?spec=${encodeURIComponent(JSON.stringify(spec))}`, { waitUntil: 'load' })
    await page.waitForFunction('window.__ready === true || window.__error', { timeout: 20000 })
    const err = await page.evaluate('window.__error || null')
    if (err) { console.error('LOAD FAIL', name, err); continue }
    for (const view of s.views) {
      const dataURL = await page.evaluate(([v, f]) => window.renderView(v, f), [view, s.focus || null])
      const file = join(OUT, `${name}-${view}.png`)
      await writeFile(file, Buffer.from(dataURL.split(',')[1], 'base64'))
      written.push(`captures/${name}-${view}.png`)
    }
  }
  if (wantViewer) written.push(...await captureViewer(page))
  await browser.close(); server.close()
  console.log('OK captured', written.length, 'views:')
  for (const w of written) console.log('  ', w)
}
main().catch(e => { console.error(e); process.exit(1) })
