# Shopping List — Scylla/Charybdis Wireless Handwired (Neptune 4 build)

Build = **handwired wireless** split keyboard (**2× HwThinker Pro Micro nRF52840**, nice!nano v2 compatible, + ZMK), 24 jari + **5 thumb** per tangan = **29 key/tangan, 58 total**. (Baris thumb punya 6 posisi matrix tapi yang terdalam tiap tangan tidak dipasang switch.) Semua link **Tokopedia**, diprioritaskan yang **terlaris & ready stok**.

> 🔩 **Keputusan rakit: SOLDER LANGSUNG (no hotswap).** Prioritas = **AWET**. Dioda + kawat disolder permanen ke kaki switch — paling sedikit titik gagal, nggak ada kontak socket yang bisa kendor/oksidasi jangka panjang. Switch Gateron G Pro rated ~50jt klik → swap nyaris nggak kepake. **Socket hotswap Gateron DIBATALKAN** (belum dibayar). Case Scylla juga terbukti (render) **tanpa pocket socket** — memang buat PCB.

> ⚠️ Catatan riset: halaman produk Tokopedia memblokir fetch otomatis, jadi **harga / jumlah terjual / rating belum terverifikasi 100%** dan **URL produk belum tentu hidup** (curl ke tokopedia.com = diblok total dari mesin ini). Yang PASTI jalan = link pencarian `/find/`. Sebelum checkout: buka link → cek stok → urutkan **Terlaris** + rating ≥4.8.

## ✅ Sudah dibeli (skip)
- [x] Switch MX Gateron G Pro Brown
- [x] Keycap PBT MOA

## ❌ Dibatalkan (tidak jadi beli)
- [x] ~~Hotswap socket Gateron~~ → solder langsung demi keawetan (belum dibayar, aman)
- [x] ~~Amoeba PCB~~ → tidak perlu (no hotswap)

## 🛠️ Catatan keawetan (yang bikin awet)
- **Heat-set insert M3** (item 8) — ulir case nggak gampang dol saat buka-tutup berkali-kali.
- **Strain relief** kabel ke nice!nano (lem/hot-glue di titik kabel masuk) — solder joint board nggak patah ketarik.
- Solder rapi pakai **flux no-clean** (item 13); sambungan dioda+kawat ke pin switch harus penuh & mengkilap.
- Dioda + kawat email = sambungan permanen, paling tahan bertahun-tahun.

---

## 🛒 Perlu dibeli

### 1. Controller — **HwThinker Pro Micro nRF52840** (nice!nano v2 compatible) · **Qty 2** (kiri+kanan)
- [x] **Terpakai (dua-duanya):** Pro Micro NRF52840 BLE 5.0 — *HwThinker*
  https://www.tokopedia.com/hwthinker/pro-micro-nrf52840-promicro-nrf52-nano-33-ble-5-0-bluetooth-nice-nano
- [ ] Alternatif: Supermini NRF52840 Dev Board (compatible nice!Nano V2.0) — *Metro Moda*
  https://www.tokopedia.com/metro-moda/supermini-nrf52840-development-board-compatible-with-nice-nano-v2-0
- Cari/bandingkan: https://www.tokopedia.com/find/nrf52840 (keyword: `pro micro nrf52840 nice nano`)
- ⚠️ **Clone ini WAJIB clock fix.** HwThinker Pro Micro nRF52840 tidak punya kristal 32.768kHz yang diasumsikan nice!nano v2 → BLE split link timeout, tangan kanan mati. Solusi: `CONFIG_CLOCK_CONTROL_NRF_K32SRC_RC=y` di `charybdis_handwired.conf` (paksa RC oscillator internal). Compile ZMK profil `nice!nano v2`.
- ℹ️ Pin **P0.22 mati** sebagai GPIO (QSPI flash) di board ini → Col1 dipindah ke P0.31 (sudah beres di dtsi). P0.20/P0.24 tetap dipakai & aman di board ini.

### 2. Baterai LiPo 3.7V · **Qty 2**
- [ ] **Utama (plug-and-play nice!nano):** 6pcs 3.7V 110mAh **301230** JST PH 2.0mm "for nice nano" — *Penggesu*
  https://www.tokopedia.com/penggesu/6pcs-lot-3-7v-110mah-301230-lithium-polymer-jst-ph-2-0mm-for-nice-nano-or-wireless-keyboard-bluetooth-headset-3d-recording-pen
  → 1 lot (6pcs) cukup buat 2 board + cadangan. Tipis (3mm), paling aman muat case.
- [ ] Kapasitas lebih besar (lebih awet, 4mm): 3.7V 500mAh **401230** — *osakasparepart*
  https://www.tokopedia.com/osakasparepart/baterai-lithium-ion-polymer-lipo-3-7v-500mah-401230
- Cari ukuran lain (502030 dll): https://www.tokopedia.com/find/502030
- ✅ nice!nano pakai **JST PH 2.0mm** — baterai utama di atas sudah berkonektor PH2.0, **tinggal colok**.

### 3. Konektor JST PH 2.0 (opsional — kalau perlu ganti/extend kabel baterai)
- [ ] Konektor JST PH 2.0mm 2-pin + kabel — cari: https://www.tokopedia.com/find/jst-ph-2.0-2pin
- ❗ JST **1.25mm** kemungkinan **TIDAK perlu** (nice!nano = 2.0mm). Beli 1.25 hanya kalau board-mu spesifik pakai itu.

### 4. Slide switch (on/off baterai) · **Qty 2**
- [ ] **Utama:** SS12D00 Saklar Geser Mini SPDT 3 Pin — *Gudang Listrik Pontianak*
  https://www.tokopedia.com/gudanglistrikpontianak/ss12d00-saklar-geser-mini-slide-switch-mini-on-on-3-pin-2-way-spdt
- [ ] Cadangan: SS12D00 G4 4mm SPDT — *TechnoHance*
  https://www.tokopedia.com/technohance/saklar-geser-kecil-3-pin-spdt-1p2t-sorong-toggle-switch-ss12d00-g4-4mm
- Cari: https://www.tokopedia.com/find/switch-spdt-3-pin

### 5. Push button reset (tactile) · **Qty 2** (cradle punya holder reset)
- [ ] **Utama:** Tactile Switch 6x6x4.3mm — *DutaPart*
  https://www.tokopedia.com/dutapart/tactile-switch-push-button-6x6x4-3-mm-6x6-x-4-3mm-pcb-mount-mini-micro
- [ ] Cadangan: Tactile Switch SMD 6x6 — *Peony Glodok*
  https://www.tokopedia.com/peonyglodok/tactile-switch-push-button-smd-6x6-2p-4p-pin-tombol-micro-momentary-4p-6x6x4-3-tanpa-bubble
- Cari: https://www.tokopedia.com/find/tactile-switch-push-button-6x6
- ℹ️ Cek dimensi pocket di `supermini_cradle.scad` (reset hole ~5×4.5mm) — pilih tinggi tuas yang pas.

### 6. Dioda 1N4148 · **~92 buah** (1 per switch) → beli 2 pack 100pcs
- [ ] **Utama (terlaris, 5.0/57 ulasan, ~Rp9.500):** 100pcs Dioda 1N4148 — *sarahelektronik*
  https://www.tokopedia.com/sarahelektronik/100pcs-dioda-1n4148-in4148
- [ ] Cadangan: 100pcs 1N4148 — *Latronika*
  https://www.tokopedia.com/latronika/100pcs-dioda-1n4148-1n-4148-rectifier-diode-in4148-in-4148-100-buah-1729816698188432867
- Cari: https://www.tokopedia.com/find/dioda-1n4148

### 7. Kawat email / enameled wire 0.25–0.3mm (~AWG30) — handwiring matrix · **~15m/tangan**
- [ ] **Utama (toko email besar, 5rb+ terjual):** Kawat Email Tembaga 0.3mm /meter — *HARDA JAYA*
  https://www.tokopedia.com/040489/kawat-email-tembaga-0-3mm-per-1meter-meteran-0-3-mm-per-1m
- [ ] Lebih tipis (0.25mm ≈ AWG30): — *ELECHOUSE ID*
  https://www.tokopedia.com/elechouse/kawat-0-25mm-0-25-tembaga-email-enamel-1-meter
- Cari: https://www.tokopedia.com/find/kawat-email-tembaga
- ℹ️ Email = berenamel, ujungnya harus dikerik/dibakar sebelum solder. Beli ~10–15m per tangan. (Alternatif lebih gampang: kawat single-core berinsulasi / kynar 30AWG.)

### 8. Heat-set insert M3 (brass, tanam panas) — fix plate ke case
- [ ] **Utama:** Brass Heat Insert M3 30pcs (3D print) — *IndoCart*
  https://www.tokopedia.com/indocart/3d-printer-tools-compatible-brass-heat-insert-nuts-double-twill-knurled-injection-copper-thread-inserts-x-30pcs-1731656093817144863
- [ ] Cadangan (pilih M3x5x4): — *Cipta Karya 3D*
  https://www.tokopedia.com/ciptakarya3d/brass-hot-melt-thread-inserts-nut-m2-m2-5-m3-m4-m5-m6-m8-double-twill-knurled-standar-internasional-gb-1pcs-1730679408596714881
- Cari: https://www.tokopedia.com/find/heat-set-insert-m3 · ukuran ideal **M3 OD4–5 / L4–5mm**

### 9. Baut M3 (socket cap, 6–10mm)
- [ ] **Utama (multi panjang dalam 1 listing):** Baut L M3 3–50mm — *salsaa-sttrre*
  https://www.tokopedia.com/salsaa-sttrre/baut-l-m3-m4-m5-3mm-4mm-5mm-6mm-8mm-10mm-14mm-16mm-20mm-25mm-30mm-m3-35mm-497db
- [ ] SUS304 socket cap M3x12 isi 10 — *BAUTMUR INDONESIA*
  https://www.tokopedia.com/bautmurindonesia/allen-bolt-baut-l-sus304-socket-cap-screw-m3x12-isi-10-pcs
- Cari: https://www.tokopedia.com/find/sekrup-m3 · saran **M3x6–M3x10** untuk masuk insert

### 10. Rubber feet / bumpon (anti-slip bawah keyboard)
- [ ] **Utama (khusus keyboard):** Rubber Feet Mechanical Keyboard — *SquarePlay*
  https://www.tokopedia.com/squareplay/rubber-feet-kaki-karet-mechanical-keyboard
- [ ] 10pcs 3M Self Adhesive Rubber Feet — *HERZ Garage*
  https://www.tokopedia.com/herzhz/10-pcs-3m-self-adhesive-rubber-feet-kaki-karet
- Cari: https://www.tokopedia.com/find/rubber-feet-3m

### 11. Kabel USB-C DATA (flashing firmware — bukan charge-only)
- [ ] **Utama (10rb+ terjual, official):** UGREEN Kabel Data USB→Type-C 3A — *UGREEN Official Store*
  https://www.tokopedia.com/ugreenofficialstore/kabel-data-usb-type-c-ugreen-for-samsung-oppo-vivo-fast-charging-3a
- Cari (pilih yang tulis "data 480Mbps"): https://www.tokopedia.com/find/kabel-data-type-c
- ⚠️ Pastikan port board = USB-C (banyak klon SuperMini USB-C). Hindari kabel "charge only".

### 12. Timah solder 0.6mm — **WAJIB (stok di rumah tinggal sedikit)**
- [ ] **Utama:** Mechanic Timah Solder 0.6mm TY-V866 — *PGC Sparepart*
  https://www.tokopedia.com/pgc-sparepart/mechanic-original-kawat-timah-solder-gulung-0-6mm-ty-v866-wire-roll
- Terlaris alt (Paragon, pilih 0.6mm): https://www.tokopedia.com/find/timah-solder-paragon
- ℹ️ Pilih rosin/flux core 0.6mm; 60/40 leaded paling gampang. ~46 switch × (dioda+kawat) butuh lumayan banyak — beli ≥1 roll.

### 12b. Alat solder (punya: **MASDA 40W original, tapi udah lama**)
- Solder 40W stick MASDA **masih cukup** buat handwiring through-hole (dioda/kawat). Tapi tip lama biasanya teroksidasi → timah susah nempel = solder rapuh (musuh "awet").
- [ ] **Mata solder / tip pengganti** (lancip, sesuai MASDA 40W) — cari: https://www.tokopedia.com/find/mata-solder-40w
- [ ] **Pembersih tip** (tip cleaner kawat kuningan / sponge) — cari: https://www.tokopedia.com/find/pembersih-mata-solder
- [ ] *(Opsional, upgrade demi presisi & awet)* **Solder station suhu-atur** (mis. 936/8586) — jauh lebih enak buat 46+ titik halus. Cari: https://www.tokopedia.com/find/solder-station-suhu
- [ ] *(Opsional)* **Penyedot timah / solder wick** buat koreksi salah solder. Cari: https://www.tokopedia.com/find/penyedot-timah-solder

### 13. Flux solder (no-clean / RMA buat PCB)
- [ ] Flux Pasta Solder 35ml (PCB & komponen) — *fanila shop*
  https://www.tokopedia.com/fanila-shop-779/flux-pasta-solder-35ml-untuk-solder-komponen-pcb-dan-stainless-tembaga-timah-logam-1730829385622718260
- Cari (rekomendasi YAXUN / Ezren RMA-616 no-clean): https://www.tokopedia.com/find/flux-solder
- ⚠️ Hindari pasta flux tukang yang asam/korosif — pilih **RMA / no-clean**.

---

## Catatan kebutuhan kuantitas
| Item | Qty | Alasan |
|---|---|---|
| Controller | 2 | kiri + kanan |
| Baterai LiPo | 2 | 1 per half (beli lot 6pcs = ada cadangan) |
| Slide switch | 2 | on/off baterai per half |
| Reset button | 2 | holder reset di cradle |
| Dioda 1N4148 | ~92 (beli 200) | 1/switch + cadangan |
| Kawat email | ~30m | ~15m/tangan matrix |
| Heat-set insert M3 | sesuai jumlah lubang plate | cek case |
| Baut M3 | sesuai insert | 6–10mm |

---

## 🧰 Alat maintenance printer PLA (reusable — kepakai terus)
> Link `/find/` pasti jalan; link produk = kandidat dari hasil search (belum terverifikasi).

### M1. Jarum pembersih nozzle 0.35–0.4mm
- [ ] Nozzle Cleaner Needle kit 10pcs (DY11) — *Hardware Solutions*
  https://www.tokopedia.com/hardwaresolutions/jarum-pembersih-nozzle-3d-printer-cleaning-needle-10pcs-dy11
- Cari: https://www.tokopedia.com/find/jarum-pembersih-nozzle
- ℹ️ Pakai 0.35mm buat nozzle 0.4 (jangan pas 0.4 biar lubang nggak melebar).

### M2. Sikat kuningan (bersihin nozzle, jangan baja)
- [ ] 12pcs Sikat Kawat Kuningan gagang lengkung 3D printer — *K-Dunk*
  https://www.tokopedia.com/k-dunk/12-pcs-sikat-kawat-tembaga-kuningan-gagang-lengkung-3d-printer
- Cari: https://www.tokopedia.com/find/sikat-kuningan-nozzle

### M3. Scraper / spatula pengangkat hasil print
- Cari (banyak pilihan stainless+gagang karet): https://www.tokopedia.com/find/scraper-3d-print · https://www.tokopedia.com/find/spatula-scraper

### M4. Pinset / tweezers ESD (1 lurus + 1 bengkok)
- [ ] Set Pinset ESD anti-static — *Pi Toserba*
  https://www.tokopedia.com/pitoserba/pinset-esd-series-anti-static-tweezers-untuk-jepit-komponen-smd-dll-paket-6-pcs-5ebe4
- Cari: https://www.tokopedia.com/find/pinset-elektronik-anti-static
- 💡 Pinset bengkok juga kepakai buat handwiring (jepit dioda/kawat).

### M5. Tang potong / flush cutter (potong support + filament)
- [ ] Nipper model kit (Plato/Xuron) — *mechaniSTORE*
  https://www.tokopedia.com/mechanistore/tang-potong-xuron-nipper-for-gundam-model-kit
- Cari: https://www.tokopedia.com/find/tang-potong-gundam

### M6. Cleaning/cold-pull filament (bersihin sisa filament di nozzle)
- Cari: https://www.tokopedia.com/find/cleaning-filament-1.75mm · https://www.tokopedia.com/find/esun-cleaning-filament

### M7. Isopropyl Alcohol (IPA) 99% — bersihin bed PEI
- [ ] IPA 99% 1 Liter — *PAChemical*
  https://www.tokopedia.com/pachemicals/isopropyl-alcohol-isopropyl-alkohol-ipa-99-1-liter
- Cari: https://www.tokopedia.com/find/isopropyl-alcohol-99
- ℹ️ Semprot ke kain dulu, jangan langsung ke bed. (Toolkit §2/§6 juga pakai IPA lap antar-print.)

---

## ✨ Finishing — biar permukaan halus (PLA)
Urutan kerja: **dempul lubang → filler primer → amplas basah halus → cat → clear coat**.

### F1. Amplas set grit 400–2000 (wet sanding)
- [ ] Amplas Duco Waterproof grit 400–3000 (beli per grit: 400/600/800/1000/1500/2000) — *wilonastore2015*
  https://www.tokopedia.com/wilonastore2015/amplas-duco-grit-400-600-800-1000-1200-1500-2000-2500-3000-sand-paper-waterproof-kertas-lembaran-amplas-basah-kering-halus-amplas-knalpot-amplas-bodi-motor-motor-besi-tembok-kayu-1731932662307980968
- Merk awet (Germany): MATADOR — https://www.tokopedia.com/jababekateknikatama/matador-amplas-kertas-grit-400-600-800-1000-1500-2000-2500-3000-kertas-amplas-waterproof-merk-matador-germany-1731892108127012125
- Cari: https://www.tokopedia.com/find/amplas-duco

### F2. Sanding block (balok amplas, biar permukaan rata)
- [ ] DSPIAE Sanding Block — *wahkhilaf*
  https://www.tokopedia.com/wahkhilaf/sanding-block-amplas-blok-pegangan-handle-datar-lurus-dspiae-curved
- Cari: https://www.tokopedia.com/find/sanding-block

### F3. Dempul / putty (tutup garis layer & lubang)
- [ ] Tamiya Putty Basic 32g (gampang diamplas, buat plastik) — *gerberas-corner*
  https://www.tokopedia.com/gerberas-corner/tamiya-putty-basic-type-dempul-gundam-model-kit-cat-kuas-airbrush
- Lubang besar: Alteco EpoPutty / Tamiya Epoxy Putty
- Cari: https://www.tokopedia.com/find/tamiya-putty · https://www.tokopedia.com/find/epoxy-putty

### F4. Filler primer / surfacer semprot (nutup layer line sebelum cat) — **penting**
- [ ] Diton Putty Primer 1K 300mL (5rb+ terjual) — cari: https://www.tokopedia.com/find/diton-putty-primer
- Modeller fav: Samurai Plastic Primer — https://www.tokopedia.com/find/samurai-paint-plastic-primer
- Cari: https://www.tokopedia.com/find/filler-primer

### F5. Cat semprot (warna dasar — brand bagus: Pylox/Samurai/Diton)
- [ ] Pylox/Pilox (mis. hitam doff) — *Saban Rame*
  https://www.tokopedia.com/sabanrame/pylox-hitam-kilap-hitam-doff-cat-semprot
- Cari: https://www.tokopedia.com/find/cat-semprot-pylox

### F6. Clear coat / pernis (lapisan akhir — **doff/matte** cocok buat case keyboard)
- [ ] Pylox Magic Clear Doff 300cc — *TSM Shops*
  https://www.tokopedia.com/tsm-shops/cat-semprot-pilox-pilok-magic-clear-doff-pernis-doff-dop-110-300cc
- Cari: https://www.tokopedia.com/find/pylox-clear-doff

### F7. Masking tape (opsional — nutup area waktu ngecat)
- Cari: https://www.tokopedia.com/find/masking-tape · presisi: https://www.tokopedia.com/find/tamiya-masking-tape

> 💡 Tips: amplas **basah** urut kasar→halus (400→600→800→1000→1500→2000), jangan loncat grit, tempel ke sanding block biar rata. Primer dulu biar cacat layer kelihatan. Beli primer+cat+clear dari **1 toko** biar hemat ongkir.

---

## 🦵 Hardware tenting stand (base stand, tanpa wrist pad)
Stand modular adjustable (`Charybdis/files/mods/tenting-stand-with-wrist-pads/`). Part udah di-prep di `tools/tent/`.
- [ ] **Baut M4 panjang ≥14mm × 8** — cari: https://www.tokopedia.com/find/baut-m4-15mm (socket cap lebih rapi)
- [ ] **Mur M4 × 8** — cari: https://www.tokopedia.com/find/mur-m4
- ℹ️ Kalau nanti mau **wrist pad gel**: butuh jadi 12 set M4 + 2 gel mouse pad (`https://www.tokopedia.com/find/gel-mouse-pad-wrist`).

## Belum perlu (ditunda)
- Battery holder / mount cradle ke case — nanti pas udah fungsional.
- JST 1.25mm — kemungkinan tidak dipakai (nice!nano = PH2.0).
