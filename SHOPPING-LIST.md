# Shopping List: Scylla/Charybdis Wireless Handwired (Neptune 4 build)

> Historical working note. The build was finished in July 2026 (see `docs/BUILD-LOG.md`); checkboxes below are as of the last edit and were not all updated after purchase.

Build = **handwired wireless** split keyboard (**2× HwThinker Pro Micro nRF52840**, nice!nano v2 compatible, + ZMK), 24 finger + **5 thumb** per hand = **29 keys/hand, 58 total**. (The thumb row has 6 matrix positions but the innermost one on each hand has no switch.) All links are **Tokopedia**, prioritising **best sellers that are in stock**.

> 🔩 **Assembly decision: SOLDER DIRECT (no hotswap).** Priority = **DURABILITY**. Diodes + wire are soldered permanently to the switch legs: fewest failure points, no socket contacts that can loosen or oxidise over time. Gateron G Pro switches are rated ~50M clicks → swapping would almost never be used. **Gateron hotswap sockets CANCELLED** (not paid yet). The Scylla case is also confirmed (render) to have **no socket pockets**, it is meant for a PCB.

> ⚠️ Research note: Tokopedia product pages block automated fetches, so **price / units sold / rating are not 100% verified** and **product URLs may not be live** (curl to tokopedia.com = fully blocked from this machine). What DEFINITELY works = the `/find/` search links. Before checkout: open the link → check stock → sort by **Terlaris** (best selling) + rating ≥4.8.

## ✅ Already bought (skip)
- [x] MX switches, Gateron G Pro Brown
- [x] PBT MOA keycaps

## ❌ Cancelled (not buying)
- [x] ~~Gateron hotswap sockets~~ → solder direct for durability (not paid yet, safe)
- [x] ~~Amoeba PCB~~ → not needed (no hotswap)

## 🛠️ Durability notes (what makes it last)
- **M3 heat-set inserts** (item 8): the case threads do not strip when it is opened and closed many times.
- **Strain relief** on the cables into the nice!nano (glue / hot glue where the cable enters): the board's solder joints do not snap when pulled.
- Solder cleanly with **no-clean flux** (item 13); the diode + wire joints on the switch pins must be full & shiny.
- Diodes + enamel wire = permanent joints, the most durable over the years.

---

## 🛒 To buy

### 1. Controller: **HwThinker Pro Micro nRF52840** (nice!nano v2 compatible) · **Qty 2** (left+right)
- [x] **In use (both):** Pro Micro NRF52840 BLE 5.0, *HwThinker*
  https://www.tokopedia.com/hwthinker/pro-micro-nrf52840-promicro-nrf52-nano-33-ble-5-0-bluetooth-nice-nano
- [ ] Alternative: Supermini NRF52840 Dev Board (compatible nice!Nano V2.0), *Metro Moda*
  https://www.tokopedia.com/metro-moda/supermini-nrf52840-development-board-compatible-with-nice-nano-v2-0
- Search/compare: https://www.tokopedia.com/find/nrf52840 (keyword: `pro micro nrf52840 nice nano`)
- ⚠️ **This clone REQUIRES the clock fix.** The HwThinker Pro Micro nRF52840 has no 32.768kHz crystal, which nice!nano v2 assumes → BLE split link times out, right hand dead. Fix: `CONFIG_CLOCK_CONTROL_NRF_K32SRC_RC=y` in `charybdis_handwired.conf` (forces the internal RC oscillator). Compile ZMK with the `nice!nano v2` profile.
- ℹ️ Pin **P0.22 is dead** as GPIO (QSPI flash) on this board → Col1 moved to P0.31 (already done in the dtsi). P0.20/P0.24 are still used & safe on this board.

### 2. LiPo battery 3.7V · **Qty 2**
- [ ] **Primary (plug-and-play nice!nano):** 6pcs 3.7V 110mAh **301230** JST PH 2.0mm "for nice nano", *Penggesu*
  https://www.tokopedia.com/penggesu/6pcs-lot-3-7v-110mah-301230-lithium-polymer-jst-ph-2-0mm-for-nice-nano-or-wireless-keyboard-bluetooth-headset-3d-recording-pen
  → 1 lot (6pcs) is enough for 2 boards + spares. Thin (3mm), the safest fit in the case.
- [ ] Larger capacity (lasts longer, 4mm): 3.7V 500mAh **401230**, *osakasparepart*
  https://www.tokopedia.com/osakasparepart/baterai-lithium-ion-polymer-lipo-3-7v-500mah-401230
- Search other sizes (502030 etc.): https://www.tokopedia.com/find/502030
- ✅ nice!nano uses **JST PH 2.0mm**: the primary battery above already has a PH2.0 connector, **just plug it in**.

### 3. JST PH 2.0 connector (optional, if the battery lead needs replacing/extending)
- [ ] JST PH 2.0mm 2-pin connector + lead, search: https://www.tokopedia.com/find/jst-ph-2.0-2pin
- ❗ JST **1.25mm** is probably **NOT needed** (nice!nano = 2.0mm). Buy 1.25 only if your board specifically uses it.

### 4. Slide switch (battery on/off) · **Qty 2**
- [ ] **Primary:** SS12D00 Saklar Geser Mini SPDT 3 Pin, *Gudang Listrik Pontianak*
  https://www.tokopedia.com/gudanglistrikpontianak/ss12d00-saklar-geser-mini-slide-switch-mini-on-on-3-pin-2-way-spdt
- [ ] Backup: SS12D00 G4 4mm SPDT, *TechnoHance*
  https://www.tokopedia.com/technohance/saklar-geser-kecil-3-pin-spdt-1p2t-sorong-toggle-switch-ss12d00-g4-4mm
- Search: https://www.tokopedia.com/find/switch-spdt-3-pin

### 5. Reset push button (tactile) · **Qty 2** (the cradle has a reset holder)
- [ ] **Primary:** Tactile Switch 6x6x4.3mm, *DutaPart*
  https://www.tokopedia.com/dutapart/tactile-switch-push-button-6x6x4-3-mm-6x6-x-4-3mm-pcb-mount-mini-micro
- [ ] Backup: Tactile Switch SMD 6x6, *Peony Glodok*
  https://www.tokopedia.com/peonyglodok/tactile-switch-push-button-smd-6x6-2p-4p-pin-tombol-micro-momentary-4p-6x6x4-3-tanpa-bubble
- Search: https://www.tokopedia.com/find/tactile-switch-push-button-6x6
- ℹ️ Check the pocket dimensions in `supermini_cradle.scad` (reset hole ~5×4.5mm) and pick a plunger height that fits.

### 6. 1N4148 diodes · **~92 pieces** (1 per switch) → buy 2 packs of 100
- [ ] **Primary (best seller, 5.0/57 reviews, ~Rp9,500):** 100pcs Dioda 1N4148, *sarahelektronik*
  https://www.tokopedia.com/sarahelektronik/100pcs-dioda-1n4148-in4148
- [ ] Backup: 100pcs 1N4148, *Latronika*
  https://www.tokopedia.com/latronika/100pcs-dioda-1n4148-1n-4148-rectifier-diode-in4148-in-4148-100-buah-1729816698188432867
- Search: https://www.tokopedia.com/find/dioda-1n4148

### 7. Enamelled wire 0.25-0.3mm (~AWG30) for handwiring the matrix · **~15m/hand**
- [ ] **Primary (big wire shop, 5k+ sold):** Kawat Email Tembaga 0.3mm /meter, *HARDA JAYA*
  https://www.tokopedia.com/040489/kawat-email-tembaga-0-3mm-per-1meter-meteran-0-3-mm-per-1m
- [ ] Thinner (0.25mm ≈ AWG30): *ELECHOUSE ID*
  https://www.tokopedia.com/elechouse/kawat-0-25mm-0-25-tembaga-email-enamel-1-meter
- Search: https://www.tokopedia.com/find/kawat-email-tembaga
- ℹ️ Enamelled = coated, the ends must be scraped/burnt before soldering. Buy ~10-15m per hand. (Easier alternative: insulated single-core wire / kynar 30AWG.)

### 8. M3 heat-set inserts (brass) to fix the plate to the case
- [ ] **Primary:** Brass Heat Insert M3 30pcs (3D print), *IndoCart*
  https://www.tokopedia.com/indocart/3d-printer-tools-compatible-brass-heat-insert-nuts-double-twill-knurled-injection-copper-thread-inserts-x-30pcs-1731656093817144863
- [ ] Backup (pick M3x5x4): *Cipta Karya 3D*
  https://www.tokopedia.com/ciptakarya3d/brass-hot-melt-thread-inserts-nut-m2-m2-5-m3-m4-m5-m6-m8-double-twill-knurled-standar-internasional-gb-1pcs-1730679408596714881
- Search: https://www.tokopedia.com/find/heat-set-insert-m3 · ideal size **M3 OD4-5 / L4-5mm**

### 9. M3 bolts (socket cap, 6-10mm)
- [ ] **Primary (many lengths in 1 listing):** Baut L M3 3-50mm, *salsaa-sttrre*
  https://www.tokopedia.com/salsaa-sttrre/baut-l-m3-m4-m5-3mm-4mm-5mm-6mm-8mm-10mm-14mm-16mm-20mm-25mm-30mm-m3-35mm-497db
- [ ] SUS304 socket cap M3x12, pack of 10, *BAUTMUR INDONESIA*
  https://www.tokopedia.com/bautmurindonesia/allen-bolt-baut-l-sus304-socket-cap-screw-m3x12-isi-10-pcs
- Search: https://www.tokopedia.com/find/sekrup-m3 · suggested **M3x6 to M3x10** to go into the inserts

### 10. Rubber feet / bumpons (anti-slip under the keyboard)
- [ ] **Primary (keyboard specific):** Rubber Feet Mechanical Keyboard, *SquarePlay*
  https://www.tokopedia.com/squareplay/rubber-feet-kaki-karet-mechanical-keyboard
- [ ] 10pcs 3M Self Adhesive Rubber Feet, *HERZ Garage*
  https://www.tokopedia.com/herzhz/10-pcs-3m-self-adhesive-rubber-feet-kaki-karet
- Search: https://www.tokopedia.com/find/rubber-feet-3m

### 11. USB-C DATA cable (firmware flashing, not charge-only)
- [ ] **Primary (10k+ sold, official):** UGREEN Kabel Data USB→Type-C 3A, *UGREEN Official Store*
  https://www.tokopedia.com/ugreenofficialstore/kabel-data-usb-type-c-ugreen-for-samsung-oppo-vivo-fast-charging-3a
- Search (pick one that says "data 480Mbps"): https://www.tokopedia.com/find/kabel-data-type-c
- ⚠️ Make sure the board port = USB-C (many SuperMini clones are USB-C). Avoid "charge only" cables.

### 12. Solder wire 0.6mm: **REQUIRED (home stock is nearly out)**
- [ ] **Primary:** Mechanic Timah Solder 0.6mm TY-V866, *PGC Sparepart*
  https://www.tokopedia.com/pgc-sparepart/mechanic-original-kawat-timah-solder-gulung-0-6mm-ty-v866-wire-roll
- Best-seller alternative (Paragon, pick 0.6mm): https://www.tokopedia.com/find/timah-solder-paragon
- ℹ️ Pick rosin/flux core 0.6mm; 60/40 leaded is the easiest. ~46 switches × (diode+wire) needs a fair amount, buy ≥1 roll.

### 12b. Soldering tools (owned: **original MASDA 40W, but old**)
- The MASDA 40W stick iron is **still enough** for through-hole handwiring (diodes/wire). But an old tip is usually oxidised → solder will not wet = brittle joints (the enemy of "durable").
- [ ] **Replacement tip** (pointed, fits MASDA 40W), search: https://www.tokopedia.com/find/mata-solder-40w
- [ ] **Tip cleaner** (brass wool / sponge), search: https://www.tokopedia.com/find/pembersih-mata-solder
- [ ] *(Optional, upgrade for precision & durability)* **Temperature-controlled soldering station** (e.g. 936/8586): much nicer for 46+ fine joints. Search: https://www.tokopedia.com/find/solder-station-suhu
- [ ] *(Optional)* **Solder sucker / solder wick** to fix soldering mistakes. Search: https://www.tokopedia.com/find/penyedot-timah-solder

### 13. Solder flux (no-clean / RMA for PCBs)
- [ ] Flux Pasta Solder 35ml (PCB & components), *fanila shop*
  https://www.tokopedia.com/fanila-shop-779/flux-pasta-solder-35ml-untuk-solder-komponen-pcb-dan-stainless-tembaga-timah-logam-1730829385622718260
- Search (recommended: YAXUN / Ezren RMA-616 no-clean): https://www.tokopedia.com/find/flux-solder
- ⚠️ Avoid plumber's flux paste, which is acidic/corrosive. Pick **RMA / no-clean**.

---

## Quantity notes
| Item | Qty | Reason |
|---|---|---|
| Controller | 2 | left + right |
| LiPo battery | 2 | 1 per half (buying the 6pcs lot = spares) |
| Slide switch | 2 | battery on/off per half |
| Reset button | 2 | reset holder in the cradle |
| 1N4148 diodes | ~92 (buy 200) | 1/switch + spares |
| Enamelled wire | ~30m | ~15m/hand for the matrix |
| M3 heat-set inserts | as many as the plate has holes | check the case |
| M3 bolts | to match the inserts | 6-10mm |

---

## 🧰 PLA printer maintenance tools (reusable, always in use)
> `/find/` links definitely work; product links = candidates from search results (not verified).

### M1. Nozzle cleaning needles 0.35-0.4mm
- [ ] Nozzle Cleaner Needle kit 10pcs (DY11), *Hardware Solutions*
  https://www.tokopedia.com/hardwaresolutions/jarum-pembersih-nozzle-3d-printer-cleaning-needle-10pcs-dy11
- Search: https://www.tokopedia.com/find/jarum-pembersih-nozzle
- ℹ️ Use 0.35mm for a 0.4 nozzle (not exactly 0.4, so the hole does not widen).

### M2. Brass brush (for cleaning the nozzle, not steel)
- [ ] 12pcs Sikat Kawat Kuningan gagang lengkung 3D printer, *K-Dunk*
  https://www.tokopedia.com/k-dunk/12-pcs-sikat-kawat-tembaga-kuningan-gagang-lengkung-3d-printer
- Search: https://www.tokopedia.com/find/sikat-kuningan-nozzle

### M3. Scraper / spatula for lifting prints
- Search (many stainless + rubber handle options): https://www.tokopedia.com/find/scraper-3d-print · https://www.tokopedia.com/find/spatula-scraper

### M4. ESD tweezers (1 straight + 1 angled)
- [ ] Set Pinset ESD anti-static, *Pi Toserba*
  https://www.tokopedia.com/pitoserba/pinset-esd-series-anti-static-tweezers-untuk-jepit-komponen-smd-dll-paket-6-pcs-5ebe4
- Search: https://www.tokopedia.com/find/pinset-elektronik-anti-static
- 💡 The angled tweezers are also useful for handwiring (holding diodes/wire).

### M5. Flush cutter (cutting supports + filament)
- [ ] Nipper model kit (Plato/Xuron), *mechaniSTORE*
  https://www.tokopedia.com/mechanistore/tang-potong-xuron-nipper-for-gundam-model-kit
- Search: https://www.tokopedia.com/find/tang-potong-gundam

### M6. Cleaning / cold-pull filament (clears leftover filament from the nozzle)
- Search: https://www.tokopedia.com/find/cleaning-filament-1.75mm · https://www.tokopedia.com/find/esun-cleaning-filament

### M7. Isopropyl Alcohol (IPA) 99% for cleaning the PEI bed
- [ ] IPA 99% 1 Liter, *PAChemical*
  https://www.tokopedia.com/pachemicals/isopropyl-alcohol-isopropyl-alkohol-ipa-99-1-liter
- Search: https://www.tokopedia.com/find/isopropyl-alcohol-99
- ℹ️ Spray onto a cloth first, not straight onto the bed. (Toolkit §2/§6 also uses an IPA wipe between prints.)

---

## ✨ Finishing, for a smooth surface (PLA)
Order of work: **fill holes with putty → filler primer → fine wet sanding → paint → clear coat**.

### F1. Sandpaper set, grit 400-2000 (wet sanding)
- [ ] Amplas Duco Waterproof grit 400-3000 (buy per grit: 400/600/800/1000/1500/2000), *wilonastore2015*
  https://www.tokopedia.com/wilonastore2015/amplas-duco-grit-400-600-800-1000-1200-1500-2000-2500-3000-sand-paper-waterproof-kertas-lembaran-amplas-basah-kering-halus-amplas-knalpot-amplas-bodi-motor-motor-besi-tembok-kayu-1731932662307980968
- Long-lasting brand (Germany): MATADOR, https://www.tokopedia.com/jababekateknikatama/matador-amplas-kertas-grit-400-600-800-1000-1500-2000-2500-3000-kertas-amplas-waterproof-merk-matador-germany-1731892108127012125
- Search: https://www.tokopedia.com/find/amplas-duco

### F2. Sanding block (keeps the surface flat)
- [ ] DSPIAE Sanding Block, *wahkhilaf*
  https://www.tokopedia.com/wahkhilaf/sanding-block-amplas-blok-pegangan-handle-datar-lurus-dspiae-curved
- Search: https://www.tokopedia.com/find/sanding-block

### F3. Putty (covers layer lines & holes)
- [ ] Tamiya Putty Basic 32g (easy to sand, for plastic), *gerberas-corner*
  https://www.tokopedia.com/gerberas-corner/tamiya-putty-basic-type-dempul-gundam-model-kit-cat-kuas-airbrush
- Large holes: Alteco EpoPutty / Tamiya Epoxy Putty
- Search: https://www.tokopedia.com/find/tamiya-putty · https://www.tokopedia.com/find/epoxy-putty

### F4. Spray filler primer / surfacer (covers layer lines before paint), **important**
- [ ] Diton Putty Primer 1K 300mL (5k+ sold), search: https://www.tokopedia.com/find/diton-putty-primer
- Modeller favourite: Samurai Plastic Primer, https://www.tokopedia.com/find/samurai-paint-plastic-primer
- Search: https://www.tokopedia.com/find/filler-primer

### F5. Spray paint (base colour; good brands: Pylox/Samurai/Diton)
- [ ] Pylox/Pilox (e.g. matte black), *Saban Rame*
  https://www.tokopedia.com/sabanrame/pylox-hitam-kilap-hitam-doff-cat-semprot
- Search: https://www.tokopedia.com/find/cat-semprot-pylox

### F6. Clear coat / varnish (final layer; **matte** suits a keyboard case)
- [ ] Pylox Magic Clear Doff 300cc, *TSM Shops*
  https://www.tokopedia.com/tsm-shops/cat-semprot-pilox-pilok-magic-clear-doff-pernis-doff-dop-110-300cc
- Search: https://www.tokopedia.com/find/pylox-clear-doff

### F7. Masking tape (optional, to mask areas while painting)
- Search: https://www.tokopedia.com/find/masking-tape · precision: https://www.tokopedia.com/find/tamiya-masking-tape

> 💡 Tips: sand **wet**, coarse→fine in order (400→600→800→1000→1500→2000), do not skip grits, stick the paper to a sanding block so it stays flat. Prime first so layer defects show up. Buy primer+paint+clear from **1 shop** to save on shipping.

---

## 🦵 Tenting stand hardware (base stand, no wrist pad)
Modular adjustable stand (`Charybdis/files/mods/tenting-stand-with-wrist-pads/`). The parts are already prepped in `tools/tent/`.
- [ ] **M4 bolts, length ≥14mm × 8**, search: https://www.tokopedia.com/find/baut-m4-15mm (socket cap looks neater)
- [ ] **M4 nuts × 8**, search: https://www.tokopedia.com/find/mur-m4
- ℹ️ If you want the **gel wrist pad** later: that needs 12 sets of M4 + 2 gel mouse pads (`https://www.tokopedia.com/find/gel-mouse-pad-wrist`).

## Not needed yet (postponed)
- Battery holder / cradle mount to the case: later, once the keyboard is functional.
- JST 1.25mm: probably not used (nice!nano = PH2.0).
