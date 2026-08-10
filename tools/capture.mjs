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
  // --- Charybdis 6-thumb work ---
  cha6:     { parts: [['Charybdis/files/mods/trackball-plug-6key/charybdis_6thumb_demo.stl', 'gray']], views: ['iso', 'top', 'right', 'front', 'back'] },
  chathumb: { parts: [['Charybdis/files/mods/trackball-plug-6key/charybdis_6thumb_demo.stl', 'gray']], focus: { center: [112, 62, 32], r: 48 }, views: ['iso', 'top', 'right'] },
  chaorig:  { parts: [['Charybdis/files/4x6/MK2/charybdis_v4_247_right.stl', 'gray']], focus: { center: [112, 62, 32], r: 48 }, views: ['top', 'iso'] },
  chafull:  { parts: [['Charybdis/files/4x6/MK2/charybdis_v4_247_right.stl', 'gray']], views: ['top'] },
  scyup:    { parts: [['tools/case_R_up.stl', 'gray']], views: ['top', 'iso'] },
  tbottom:  { parts: [['tools/tent/bottom.stl', 'gray']], views: ['iso','front','right'] },
  thinge:   { parts: [['tools/tent/left-case-bottom-scylla.stl', 'gray']], views: ['iso','front','right'] },
  tarm:     { parts: [['tools/tent/tenting-arm.stl', 'gray']], views: ['iso','front','right'] },
  tasm:     { parts: [['tools/tent/bottom.stl','green'],['tools/tent/plate.stl','orange'],['tools/tent/tenting-arm.stl','blue']], views: ['iso','front','right'] },
  adcore:   { parts: [['tools/tent/adapter_core.stl','orange']], views: ['iso','front','right'] },
  graft:    { parts: [['tools/tent/cover_integrated.stl','orange']], views: ['iso','top','right','front'] },
  brk:      { parts: [['tools/tent/graft_plate_dl.stl','gray'],['tools/tent/graft_hinge_dl.stl','orange']], views: ['iso','right','front','top'] },
  brk2:     { parts: [['tools/tent/cover_bracket.stl','orange']], views: ['iso','right','front','back'] },
  bonly:    { parts: [['tools/tent/bracket_only.stl','orange']], views: ['iso','right','front','top'] },
  finstl:   { parts: [['tools/tent/tenting_cover_FINAL.stl','orange']], views: ['iso','right','front','bottom'] },
  scyright: { parts: [['tools/case_RIGHT_up.stl', 'gray']], views: ['top', 'iso'] },
  scylla:   { parts: [['Scylla/files/MK2/scylla_v3_36.stl', 'gray']], views: ['iso', 'top', 'front', 'back', 'right', 'left'] },
  scythumb: { parts: [['Scylla/files/MK2/scylla_v3_36.stl', 'gray']], focus: { center: [45, 30, 45], r: 44 }, views: ['front', 'right', 'iso2'] },
  scy6:     { parts: [['Scylla/files/MK2/scylla_6thumb.stl', 'gray']], focus: { center: [38, 30, 38], r: 52 }, views: ['front', 'right'] },
  scyio:    { parts: [['Scylla/files/MK2/scylla_v3_36.stl', 'gray']], focus: { center: [-72, 12, -87], r: 24 }, views: ['bottom'] },
  // --- tenting cover fit (case_RIGHT_up frame) ---
  tentfit:  { parts: [['tools/case_RIGHT_up.stl', 'gray', 0.45], ['tools/tent/cover_tent_RIGHT.stl', 'orange']], views: ['front', 'right', 'left', 'back', 'iso'] },
  tentedge: { parts: [['tools/case_RIGHT_up.stl', 'gray'], ['tools/tent/cover_tent_RIGHT.stl', 'orange']], focus: { center: [2, 9, -2], r: 90 }, views: ['front', 'right'] },
  tentcov:  { parts: [['tools/tent/cover_tent_RIGHT.stl', 'orange']], views: ['bottom', 'iso', 'top'] },
  optA:     { parts: [['tools/tent/bottom.stl', 'green'], ['tools/tent/tenting-arm.stl', 'yellow'], ['tools/tent/optionA_adapter.stl', 'orange'], ['tools/assembled_optionA_case.stl', 'gray', 0.55]], views: ['top', 'bottom', 'front', 'iso'] },
  scysock:  { parts: [['Scylla/files/MK2/scylla_v3_36.stl', 'gray']], views: ['bottom', 'iso'] },
  scysockz: { parts: [['Scylla/files/MK2/scylla_v3_36.stl', 'gray']], focus: { center: [20, 35, -20], r: 40 }, views: ['bottom'] },
  asmag:    { parts: [['tools/tent/bottom.stl','green'],['tools/tent/tenting-arm.stl','yellow'],['tools/tent/optionA_adapter.stl','orange'],['tools/assembled_optionA_case.stl','gray',0.5],['tools/tent/mag/mag_kb.stl','red'],['tools/tent/mag/mag_tent.stl','blue']], views: ['right','front','iso','top'] },
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
