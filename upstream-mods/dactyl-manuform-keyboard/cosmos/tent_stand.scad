// =====================================================================
// Tenting STAND for the Cosmos Dactyl (right half) -- v6
//   STATIC leg (fixed length). Lock slots are spaced EVENLY IN X (printable
//   pitch) on a SOLID base web; the cover angle for each slot is solved
//   numerically. Foot-tab seats into the slot. True flat (0) fold for storage.
// =====================================================================
include <BOSL2/std.scad>
$fn = 28;

use <../../cosmos/case_outline.scad>   // real case footprint outline (gen: tools/gen-case-outline.mjs)

TC = 3; TB = 8.5;          // cover / base thickness. base 8.5 mm: top 4 mm is a FOLD POCKET that
                           //   nests the folded leg; slots live BELOW it (stacked) so fold-flat works
pocket_depth = 4.0;        // depth of the fold pocket (> pivot-eye Ø3.5, so the eye clears when nested)
slot_top     = TB - pocket_depth;   // = 4.5 — slot/foot engagement level (pocket floor)
HINGE_X = 83;              // moved out to the real pinky edge (~85); knuckles clipped to plate
knk_r = 5;                 // main-hinge knuckle radius (Ø10)
hinge_rod   = 2.0;         // SAME Ø2 brass rod as the pivot — one rod size to buy, cut to length
hinge_fit   = 0.2;         // bore = rod+fit = 2.2 → the COVER knuckles rotate snug on it (low play)
hinge_blind = 1.6;         // blind wall at the −Y end (base) → rod can't slide out that side
hinge_grip  = 0.1;         // press-grip at the +Y entry (base) → rod retained captive, no clip
pin_d = hinge_rod + hinge_fit;   // = 2.2 — main-hinge bore Ø
HINGE_Y0 = -8; HINGE_Y1 = 76;   // knuckles span only where the footprint reaches HINGE_X (pinky lobe)

PIVOT_X = 10;
LEG_LEN = 75;

/* [Lock slots] */
n_slots   = 9;            // 9 tent steps (12°→57°); coarse angle steps → sturdy ribs, reliable lock
slot_x0   = -62;          // innermost slot X
slot_pitch= 8;            // even X spacing → rib ≈ 2.3 mm after the angled, widened slots
slot_w    = 3.6;          // groove WIDE enough to swallow the full leg end (prop_th 3 + 0.3/side)
foot_w    = 60;           // along Y (parallel to hinge) — WIDER leg for rigidity (slot length tracks)
foot_th   = 3.0;          // foot = full leg thickness, so the slot holds the LEG, not a thin tab
foot_h    = 3;            // slot depth
foot_seat = 2.4;          // foot tab length (< foot_h) → toe clears the slot floor; the lock bears
                          //   on the angled BACK wall, not the floor, so it seats with room to spare
slot_tilt_max = 30;       // each slot leans TOWARD the pivot by the leg angle (capped) → the leg
                          //   end seats flush in an angled pocket aligned with its thrust, not on an edge
prop_w    = 60;           // leg width along Y = foot_w (wider, NOT thicker)
prop_th   = 3;            // leg thinned so it nests inside the 3.5 mm fold pocket
frame_w   = 11;
slot_xs   = [ for (i=[0:n_slots-1]) slot_x0 + i*slot_pitch ];

/* [Leg pivot — interleaved knuckle hinge pinned by a Ø2 BRASS ROD] */
LEG_Y     = 24;           // Y-centre of the WHOLE leg mechanism (leg + pivot + slots) — shifted off 0
                          //   to sit under the keyboard's mass centroid (≈24), not the thumb side.
                          //   The hinge stays at the pinky edge; only the prop assembly moves in Y.
pivz_off  = 2.0;          // pivot axis below the cover bottom — folded knuckles center in the pocket
                          //   (z≈6.5, within slot_top..TB) and clear the cover plate when deployed
n_pk      = 5;            // pivot knuckles across the leg width (cover 3 + leg 2, interleaved)
pk_rod    = 2.0;          // brass rod Ø (HobbyMio Ø2.0) — the pivot axle, INSERTED (snug → low play)
pk_fit    = 0.2;          // diametral clearance: bore = rod+fit = 2.2 → leg rotates snug, light friction
pk_knk    = 3.8;          // knuckle Ø (fits the ~4 mm fold-pocket envelope; Ø2 rod → 0.8 mm walls)
pk_axgap  = 0.8;          // axial gap between interleaved knuckles
pk_blind  = 1.6;          // closed wall at the −Y end of the cover barrel → rod can't slide out that side
pk_grip   = 0.1;          // entry knuckle bore undersize (Ø rod−grip press-grip) → rod retained, no clip
pk_r      = pk_knk/2;     // eye radius (kept for pad sizing references)

bosses = [[29.09,-20.05],[-54.53,-13.11],[-28.77,-56.95],[62.61,-10.87],
          [-47.22,61.11],[50.51,78.53],[81.77,48.51]];

// --- solve cover angle so the fixed leg foot lands at slot X (binary search) ---
// The pivot sits at cover-local (PIVOT_X, -pivz_off); place_cover(th) maps it to (pivx,pivz).
function dd() = HINGE_X - PIVOT_X;
function pivx(th) = HINGE_X - dd()*cos(th) - pivz_off*sin(th);
function pivz(th) = TB + dd()*sin(th) - pivz_off*cos(th);
// distance^2 from pivot(world) to foot(X, slot_top) minus LEG_LEN^2
function err(th, X) = pow(pivx(th) - X, 2) + pow(pivz(th) - slot_top, 2) - LEG_LEN*LEG_LEN;
function solveAngle(X, lo=1, hi=60, n=34) =
  n <= 0 ? (lo+hi)/2
  : (err((lo+hi)/2, X) < 0 ? solveAngle(X, (lo+hi)/2, hi, n-1)
                           : solveAngle(X, lo, (lo+hi)/2, n-1));

// tilt (about Y, capped) that makes a slot — and the foot tab seated in it — lean toward the
// pivot so it aligns with the leg's slope. atan2(Δx,Δz) = angle of the leg axis from vertical.
function slotTilt(x) = min(atan2(pivx(solveAngle(x))-x, pivz(solveAngle(x))-slot_top), slot_tilt_max);

module foot2d() case_outline();   // stand footprint = the case silhouette → cover/base match the case

// Clean interleaved knuckle hinge: base gets even knuckles, cover gets odd ones,
// all on the HINGE_X axis over [HINGE_Y0,HINGE_Y1] (inside the footprint), with a
// printable gap. A straight pin bore goes through all of them -> assemblable.
n_knk = 7;
module hinge_knuckles(parity, z) {
  len = HINGE_Y1 - HINGE_Y0; seg = len/n_knk; gap = 0.6;
  for (i=[0:n_knk-1]) if (i%2==parity)
    translate([HINGE_X, HINGE_Y0+seg/2+i*seg, z]) ycyl(d=knk_r*2, h=seg-gap);
}
// main hinge BASE bore: clearance from a −Y BLIND wall to a +Y press-GRIP → the brass rod is held
// captive in the BASE (blind one end + grip the other), exactly like the leg pivot. Base = parity 0,
// so its outermost knuckles (i=0 at −Y, i=6 at +Y) carry the blind + grip.
module hinge_basebore(z) translate([HINGE_X,0,z]) {
  yLo = HINGE_Y0 + hinge_blind;     // blind wall at the −Y end
  yHi = HINGE_Y1 + 3;               // open past the +Y face
  gripStart = HINGE_Y1 - 6;         // press-grip over the +Y entry knuckle
  translate([0, (yLo+gripStart)/2, 0]) ycyl(d=pin_d, h=gripStart-yLo);                  // clearance
  translate([0, (gripStart+yHi)/2, 0]) ycyl(d=hinge_rod-hinge_grip, h=yHi-gripStart);   // grip
}
// main hinge COVER bore: plain clearance → the cover knuckles rotate on the rod
module hinge_coverbore(z) translate([HINGE_X,(HINGE_Y0+HINGE_Y1)/2,z]) ycyl(d=pin_d, h=HINGE_Y1-HINGE_Y0+8);

// --- interleaved knuckle pivot hinge (leg ↔ cover), axis along Y, pinned by a Ø2 BRASS ROD ---
// COVER knuckles (parity 0, each webbed to the plate) interleave with LEG knuckles (parity 1); a
// brass rod through all = a real pinned hinge (low play, stiff). The rod is RETAINED captive by a
// blind wall at the −Y end of the cover barrel + a press-grip at the +Y entry knuckle — no clip,
// nothing to lose. Cover & leg print SEPARATELY, then you slide the rod in. Mirrors the main hinge.
module pk_knuckles(parity) {              // solid knuckles of one leaf
  seg = prop_w/n_pk;
  for (i=[0:n_pk-1]) if (i%2==parity)
    translate([0,-prop_w/2+seg/2+i*seg,0]) ycyl(d=pk_knk, h=seg-pk_axgap);
}
module pk_relief(parity) {                                     // clear the OTHER leaf's knuckles + gap
  seg = prop_w/n_pk;
  for (i=[0:n_pk-1]) if (i%2==parity)
    translate([0,-prop_w/2+seg/2+i*seg,0]) ycyl(d=pk_knk+0.8, h=seg+pk_axgap);
}
// LEG bore: plain clearance through, so the leg knuckles rotate on the rod (snug, light friction).
module pk_legbore() ycyl(d=pk_rod+pk_fit, h=prop_w+4);
// COVER bore: clearance from the −Y BLIND wall to the +Y entry, then a short press-GRIP at the
// entry knuckle so the inserted rod is held captive (blind one end + grip the other).
module pk_coverbore() {
  yLo = -prop_w/2 + pk_blind;     // bore starts pk_blind in from the −Y face → leaves the blind wall
  yHi =  prop_w/2 + 2;            // open past the +Y face
  gripLen = 5;                    // press-grip length at the +Y entry knuckle
  translate([0, (yLo + (yHi-gripLen))/2, 0]) ycyl(d=pk_rod+pk_fit, h=(yHi-gripLen)-yLo);   // clearance
  translate([0, ((yHi-gripLen) + yHi)/2, 0]) ycyl(d=pk_rod-pk_grip, h=gripLen);            // grip
}
// Interleaved-hinge relief: each leaf must be CUT AWAY at the OTHER leaf's knuckle positions so
// the opposing Ø10 knuckles clear it through the full swing. base subtracts the cover-knuckle
// (parity 1) positions; cover subtracts the base-knuckle (parity 0) positions. Coaxial with the
// hinge axis, so it stays aligned at every cover angle.
module hinge_relief(parity, z) {
  len = HINGE_Y1 - HINGE_Y0; seg = len/n_knk;
  for (i=[0:n_knk-1]) if (i%2==parity)
    translate([HINGE_X, HINGE_Y0+seg/2+i*seg, z]) ycyl(d=knk_r*2+1.4, h=seg+0.6);
}

// ---- BASE: rigid frame + SOLID fold-pad. The pad's top (z = slot_top..TB) is a POCKET that
//      nests the folded leg; the lock slots are grooves cut BELOW the pocket floor (z =
//      slot_top-foot_h .. slot_top). So folded leg and slots STACK vertically and never clash. ----
module base() {
  pad_lo = min(slot_xs)-8;        // pad covers the slots …
  pad_hi = PIVOT_X + pk_r + 3;    //   … up to past the pivot (folded leg + eye land on it)
  difference() {
    union() {
      difference() {                              // outer rigid frame (full height)
        linear_extrude(TB) foot2d();
        translate([0,0,-1]) linear_extrude(TB+2) offset(-frame_w) foot2d();
      }
      intersection() {                            // SOLID fold-pad under the leg's fold path (at LEG_Y)
        linear_extrude(TB) foot2d();
        translate([(pad_lo+pad_hi)/2,LEG_Y,TB/2]) cube([pad_hi-pad_lo, foot_w+16, TB], center=true);
      }
      hinge_knuckles(0, TB);
    }
    hinge_basebore(TB);                          // brass-rod bore: blind −Y + press-grip +Y (rod captive in base)
    hinge_relief(1, TB);                         // clear the frame/base for the COVER knuckles
    // fold pocket — open channel in the pad top where the folded leg + eye nest
    translate([(pad_lo+pad_hi)/2, LEG_Y, (slot_top+TB)/2+0.01])
      cube([pad_hi-pad_lo+0.2, prop_w+2, pocket_depth+0.02], center=true);
    // lock slots — angled grooves cut into the pocket floor. The BACK (-X) wall leans toward the
    // pivot to match the leg slope (flush seat + the leg thrust wedges the foot down it); the FRONT
    // (+X, entry) side is relieved with a vertical mouth so the steeper leg body drops in without
    // clipping an overhang lip. Union of the tilted groove + a vertical mouth gives both.
    for (x=slot_xs) {
      a = slotTilt(x);
      translate([x,LEG_Y,slot_top]) rotate([0,a,0]) translate([0,0,-foot_h/2+0.01])
        cube([slot_w, foot_w+1, foot_h+0.02], center=true);                       // angled back wall
      translate([x+slot_w/2,LEG_Y,slot_top-foot_h/2+0.01])
        cube([slot_w, foot_w+1, foot_h+0.02], center=true);                       // vertical entry mouth
    }
    // park groove — where the FOLDED leg's foot tab rests in storage (x = pivot - leg length).
    // widened so the 30°-tilted folded foot still clears.
    translate([PIVOT_X-LEG_LEN, LEG_Y, slot_top-foot_h/2+0.01])
      cube([foot_th+4, foot_w+1, foot_h+0.02], center=true);
  }
}

// ---- COVER: SOLID bottom cover (no holes except the small case-screw holes) +
//      engsel-tengah lug. screw_d/screws control the cover↔case mount screws. ----
cover_inset = 0.8;   // tiny tuck so the cover hides just under the case rim (footprint already = case)
screw_d    = 3.4;    // small M3 clearance hole to join cover -> case
module cover_raw() {
  difference() {
    union() {
      linear_extrude(TC) offset(-cover_inset) foot2d();
      hinge_knuckles(1, 0);
      // pivot — COVER knuckles (parity 0), each webbed up to the cover plate (only at parity-0
      // segments so the leg knuckles clear). The brass rod is bored through these (see difference).
      translate([PIVOT_X,LEG_Y,-pivz_off]) pk_knuckles(0);
      for (i=[0:n_pk-1]) if (i%2==0) let (sy = LEG_Y-prop_w/2+(prop_w/n_pk)*(i+0.5))
        hull() {
          translate([PIVOT_X,sy,-pivz_off]) ycyl(d=pk_knk, h=prop_w/n_pk-pk_axgap);
          translate([PIVOT_X,sy,TC-0.5])    cube([pk_knk, prop_w/n_pk-pk_axgap, 1], center=true);
        }
    }
    // small case-screw holes (clipped to the cover footprint as a safety)
    intersection() {
      for (b=bosses) translate([b[0],b[1],-1]) cylinder(d=screw_d, h=TC+2);
      translate([0,0,-2]) linear_extrude(TC+4) offset(-cover_inset) foot2d();
    }
    hinge_coverbore(0);   // main-hinge clearance bore → cover knuckles rotate on the rod
    hinge_relief(0, 0);   // notch the cover leaf at the BASE-knuckle positions so they clear when opening
    translate([PIVOT_X,LEG_Y,-pivz_off]) pk_coverbore();   // brass-rod bore: blind −Y end + press-grip +Y entry
  }
}

module place_cover(angle)
  translate([HINGE_X,0,TB]) rotate([0,angle,0]) translate([-HINGE_X,0,-TB])
    translate([0,0,TB]) children();

// captive pivoting leg between pivot (pvx,pvz) and foot (fx,fz). Top end is a fork (clevis)
// that straddles the cover lug; a Y pin makes it a real pivot. Used for both deploy and fold.
// rise = how much the foot-end of the body sits above fz. Deploy uses a small rise so the body
// clears the base top while the tab dips into the groove; the folded leg uses rise=0 (lies flat).
module legBuild(pvx, pvz, fx, fz, rise=0)
  let (ftilt = min(atan2(pvx-fx, pvz-fz), slot_tilt_max))   // foot leans toward pivot = matches the slot
  translate([0, LEG_Y, 0])   // whole leg shifted to LEG_Y
  difference() {
    union() {
      hull() {                                   // leg body, full width
        translate([pvx,0,pvz]) ycyl(d=prop_th, h=prop_w);
        translate([fx,0,fz+rise]) ycyl(d=prop_th, h=prop_w);
      }
      translate([pvx,0,pvz]) pk_knuckles(1);             // LEG half: knuckles (parity 1) at the pivot
      translate([fx,0,fz]) rotate([0,ftilt,0]) translate([0,0,-foot_seat/2])
        cuboid([foot_th, foot_w, foot_seat], anchor=CENTER);   // angled foot → angled groove (toe clears floor)
    }
    translate([pvx,0,pvz]) pk_relief(0);                 // clear the COVER knuckles + webs (parity 0)
    translate([pvx,0,pvz]) pk_legbore();                 // clearance bore → leg knuckles rotate on the rod
  }
deploy_rise = foot_h*0.4;   // how high the leg BODY rides above the foot when deployed (tab still seats)
module leg_at(X) { th = solveAngle(X); legBuild(pivx(th), pivz(th), X, slot_top, deploy_rise); }

module leg_at_slot(i) leg_at(slot_xs[i]);   // leg alone, foot seated in slot i (for colored lock check)


// deployed at slot index i
module assembly(i=4) {
  th = solveAngle(slot_xs[i]);
  color("Gray")     base();
  color("Orange")   place_cover(th) cover_raw();
  color("SteelBlue") leg_at(slot_xs[i]);
}

// TRUE FLAT (0): cover flush on base, leg folded flat — it nests in the base-top fold pocket
// (z = slot_top..TB), lying over the recessed slots. Folded pivot z = pivz(0).
module folded() {
  color("Gray")   base();
  color("Orange") place_cover(0) cover_raw();
  color("SteelBlue") legBuild(PIVOT_X, pivz(0), PIVOT_X-LEG_LEN, pivz(0));
}

// --- world-posed single parts for the interference checker (modules see slot_xs/pivz; `use` does NOT import vars) ---
module world_cover(i)     place_cover(solveAngle(slot_xs[i])) cover_raw();
module world_cover_flat() place_cover(0) cover_raw();
module world_leg_fold()   legBuild(PIVOT_X, pivz(0), PIVOT_X-LEG_LEN, pivz(0));  // real forked leg, nested
// --- kinematic sweep: cover at arbitrary angle th, leg swung so its foot rides just CLEAR of the
//     rib tops (you lift the foot over the ribs to change slots — it doesn't drag through them).
//     Traces the real fold/deploy arc; checks the leg BODY clears the base pocket + the cover. ---
ride_z = slot_top + foot_h + 0.5;   // foot height during the swing (tab clears the ribs)
function footx_th(th) = pivx(th) - sqrt(max(0, LEG_LEN*LEG_LEN - pow(pivz(th)-ride_z, 2)));
module world_cover_th(th) place_cover(th) cover_raw();
module world_leg_th(th)   legBuild(pivx(th), pivz(th), footx_th(th), ride_z, 0);

assembly(4);
