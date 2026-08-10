# Print Queue — Scylla wireless build (Neptune 4 Pro)

Final functional keyboard = **Scylla 5-thumb default** (no case mods) + handwired wireless.
Print **one part at a time** (toolkit §4). Slicer must emit `gcode_flavor=klipper`.
Slice via: `python3 ~/Documents/neptune4-print-toolkit/scripts/slice.py --stl <file> --orient 1 --process <profile>`
(slice.py injects fresh bed mesh + Z offset automatically).

All files watertight ✓. Bed 235×235×280 — everything fits.

> ⚠️ **KOREKSI HANDEDNESS (2026-06-30): penamaan file repo ini KEBALIK** (terverifikasi: render banding vs Charybdis `_right` + IoU plate). Yang ada di repo:
> - `scylla_v3_36.stl` & `supermini_cradle.stl` = **KIRI** → tangan KANAN = **mirror X**.
> - `..._plate_right.stl` = sebenarnya **plate KIRI**; `..._plate_left.stl` = sebenarnya **plate KANAN**.
> Kolom "File" di bawah sudah dikoreksi ke hand sebenarnya. Mirror dibuat via `tools/` (mis. `tools/case_RIGHT_up.stl`).

| # | Part | Qty | File sebenarnya (hand benar) | Size (mm) | Profile | Orientasi & catatan |
|---|---|---|---|---|---|---|
| **1** | SuperMini cradle (KIRI) | 1 | `Scylla/files/MK2/supermini_cradle.stl` (=KIRI) | 30×8×34 | **process_parts_safe** | ✅ SUDAH DIPRINT (dulu dikira "R", ternyata KIRI). Simpan buat half kiri |
| **2** | SuperMini cradle (KANAN) | 1 | mirror X dari #1 | 30×8×34 | process_parts_safe | Belum diprint |
| **3** | Bottom plate (KIRI) | 1 | `Scylla/files/MK2/scylla_v3_36_plate_right.stl` (file "right" = KIRI) | 155×159×2 | **process_draft** | Flat; tipis 2mm. Rotasi Y-up→Z-up sebelum slice |
| **4** | Bottom plate (KANAN) | 1 | `Scylla/files/MK2/scylla_v3_36_plate_left.stl` (file "left" = KANAN) | 155×159×2 | process_draft | Flat |
| **5** | Case (KIRI) | 1 | `Scylla/files/MK2/scylla_v3_36.stl` (=KIRI) | 159×163×58 | **process_parts_safe** | Open-bottom DOWN, keys up, ~58mm. Support ON. Print ~23j. (sebagian sempat keprint) |
| **6** | Case (KANAN) | 1 | mirror X → `tools/case_RIGHT_up.stl` | 159×163×58 | process_parts_safe | ⏳ LAGI DIPRINT sekarang. gcode: `out/case_RIGHT_safe.gcode` |

## Catatan profil
- **process_parts** = kualitas normal (buat case — presisi lubang switch & fit penting).
- **process_parts_safe** = profil aman buat part kecil/overhang (cradle).
- **process_draft** = cepat, buat plate flat.
- **process_brim** / `--brim`: nyalain brim buat part tipis/kecil (#1–4).
- filament_fast + machine_train = filament & machine profile (dipakai default sama slice.py).

## Urutan saran
1 (cradle, test) → 3,4 (plate, cepat) → 5,6 (case, lama). Cradle dulu biar profil & first-layer terverifikasi sebelum commit print case yang berjam-jam.

## Tenting stand — ✅ VERIFIED READY (2026-07-05) — integrated cover, base stand, tanpa wrist pad
**Cover terintegrasi** (seal plate + engsel jadi SATU part) — gantikan plate polos #3/#4. Diverifikasi:
- **Align ke case: IoU outline 0.9989** vs plate resmi; flush keliling di render overlay (`tools/captures/tentfit-*.png`); protrusion cuma 0.2% = knuckle engsel (fungsional).
- **Watertight** ✓ L+R (genus 14, vol 65.3cm³); 7 lubang sekrup countersunk M4 pola resmi; knuckle spacing 70.0mm; bore M4 horizontal saat print vertikal.
- Riwayat: `final_cover_dl` lama ketinggalan di **pose deployed (rotY −30°)** & ternyata hand KANAN → di-un-pose (rotY −30.05, rotX −0.15), registrasi, union via manifold-3d (backend OpenSCAD nolak mesh-nya), mirror → KIRI.
- **SMOOTH pass (5 Jul):** underside dulunya ber-*ledge* (plate intbottom repo lebih kecil nggantung 2mm di bawah seal) → dilaminasi jadi **slab 4mm uniform se-outline seal** (salinan seal digeser −1.6, inset 0.05mm biar boolean bersih) → muka bawah SATU bidang rata, gusset engsel nyatu mulus. Genus −7 = 7 void countersink lama terkubur (harmless; kepala sekrup duduk di countersink baru di muka bawah). ⚠️ Plate kini ~3.7mm: pakai **baut M4 10mm** ke case (8mm agak pendek).

Profil **`proc_tent`** (process_parts base: infill **25%**, brim 5mm, **support OFF** — gusset knuckle self-supporting, sesuai foto repo). Gcode fresh di `out/` (5 Jul):

| Part | Qty | Est | gcode | STL sumber | Orientasi |
|---|---|---|---|---|---|
| Tent-cover KIRI | 1 | ~9j 26m | `out/tent_cover_LEFT.gcode` | `tools/tent/cover_tent_LEFT_vert.stl` | **vertikal** (sudah dibake di STL; slice `--orient 0`) |
| Tent-cover KANAN | 1 | ~9j 28m | `out/tent_cover_RIGHT.gcode` | `tools/tent/cover_tent_RIGHT_vert.stl` | vertikal |
| Base bottom KIRI | 1 | ~2j 56m | `out/tent_bottom_LEFT.gcode` | `tools/tent/bottom.stl` | flat (auto) |
| Base bottom KANAN | 1 | ~2j 57m | `out/tent_bottom_RIGHT.gcode` | `tools/tent/bottom_R.stl` | flat |
| Tenting arm | **2** | ~1j 47m /pc | `out/tent_arm.gcode` (print 2×) | `tools/tent/tenting-arm.stl` | flat (auto) |

Total ~30 jam. STL flat-pose (frame case, buat preview/CAD): `tools/tent/cover_tent_LEFT.stl` / `_RIGHT.stl`; rakitan display: `tools/assembled_LEFT.stl` / `_RIGHT.stl`. Hardware: 8× baut M4 ≥14mm + 8× mur M4.

## Belum di-queue (sengaja, nanti)
- Baterai holder, mount cradle ke case — ditunda sampai fungsional.
- Wrist pad gel — opsional, part di `tools/tent/wrist-pad-variant-parts/` (+12 M4, +2 gel pad).
- ~~6-thumb~~ — di-abort, pakai 5-thumb default.
