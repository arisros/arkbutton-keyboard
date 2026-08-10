/*
 * Charybdis 4x6 — trackball-cavity plug that becomes the 6th THUMB key.
 * Drops into the unmodified trackball bore of charybdis_v4_247_right.stl and
 * mounts one MX (Gateron) hotswap switch. The big case STL stays pure.
 *
 * Frame: +Z = the cavity insertion axis (points up out of the case). The case
 * cavity opening tilts ~29 deg from horizontal toward the user; mounting a flat
 * switch would inherit that 29 deg. We counter-rotate the switch plate by
 * TILT_CORR so the keycap ends up ~15 deg. The notch on the flange marks the
 * USER/thumb side so you orient the plug correctly (and check the tilt sense on
 * the first print — flip TILT_CORR's sign if it leans the wrong way).
 *
 * Measurements come from the stock parts:
 *   adapter_v4_v4_top.stl -> body OD ~42, flange OD 45.6, body height ~18
 *   case trackball pocket -> ~20 mm deep, opening plane 29 deg.
 *
 * Units: mm.
 */

// ---------------- Parameters ----------------
$fn = 140;

// Outer fit (match the stock trackball adapter so it drops into the bore)
body_od      = 41.7;   // into the 42 mm case bore (0.3 mm clearance)
flange_od    = 45.6;   // rests on the case rim
flange_t     = 3.0;    // flange thickness
body_h       = 18.0;   // depth into the bore
wall         = 2.6;    // shell wall thickness
floor_t      = 1.6;    // closed bottom thickness (dust seal)

// Switch mount
tilt_corr    = 14;     // deg: 29 (case) - 14 = ~15 deg effective cap tilt
recess_depth = 4.0;    // switch top-plate sits this far below the flange top
plate_thick  = 1.5;    // MX retention lip (switch clips grab this)
boss_total   = 6.5;    // total switch-platform thickness (plate + pocket)
switch_hole  = 14.0;   // MX switch cutout (square)
cap_open_d   = 25.0;   // opening through the flange for the (tilted) keycap

// MX hotswap pocket (Gateron) — TUNE after first print if the socket is tight.
// Standard Cherry-MX pin positions relative to switch center:
pinA         = [-3.81, 2.54];   // switch leg / contact 1
pinB         = [ 2.54, 5.08];   // switch leg / contact 2
pin_d        = 3.0;             // through-hole for legs + socket contacts
hs_depth     = 1.95;            // socket recess depth from the plate underside
hs_w         = 5.2;             // socket channel width
hs_mouth     = 6.0;            // open this side so the socket slides in (toward -X)

// Front (user/thumb) index notch on the flange
notch_w      = 3.0;
notch_d      = 1.6;

// ---------------- Helpers ----------------
// Apply the switch tilt about the centre of the plate top plane.
module tilted() {
    translate([0, 0, -recess_depth])
        rotate([tilt_corr, 0, 0])
            children();
}

// Solid outer envelope: body cylinder + flange disc.
module outer_solid() {
    union() {
        // body into the bore
        translate([0, 0, -body_h]) cylinder(h = body_h, d = body_od);
        // flange on top
        cylinder(h = flange_t, d = flange_od);
        // small lead-in chamfer at the body's bottom edge for easy insertion
        translate([0, 0, -body_h])
            cylinder(h = 1.2, d1 = body_od - 2.0, d2 = body_od);
    }
}

// Big interior cavity that would hollow the whole body.
module inner_void() {
    translate([0, 0, -body_h + floor_t])
        cylinder(h = body_h + flange_t, d = body_od - 2 * wall);
}

// The tilted switch platform we KEEP inside the hollow (fused to the walls).
module plate_keepout() {
    tilted()
        translate([0, 0, -boss_total/2])
            cylinder(h = boss_total, d = body_od + 6);   // oversize -> trimmed by outer_solid
}

// Switch cutout + hotswap pocket, in the tilted frame.
module switch_cutouts() {
    tilted() {
        // through switch hole (square), generous in Z
        translate([0, 0, -boss_total - 6])
            cube([switch_hole, switch_hole, boss_total + 14], center = true);

        // leg / contact through-holes
        for (p = [pinA, pinB])
            translate([p[0], p[1], -boss_total - 6])
                cylinder(h = boss_total + 14, d = pin_d);

        // hotswap socket recess on the plate underside (z just below the plate)
        // covers both pins + a slide-in mouth toward -X.
        translate([0, 0, -plate_thick - hs_depth/2]) {
            hull() {
                translate([pinA[0], pinA[1], 0]) cube([hs_w, hs_w, hs_depth], center = true);
                translate([pinB[0], pinB[1], 0]) cube([hs_w, hs_w, hs_depth], center = true);
            }
            // mouth so the socket can slide in from the side
            translate([-body_od/2, pinA[1], 0])
                cube([hs_mouth*2, hs_w, hs_depth], center = true);
        }
    }
}

// Open the flange so the tilted keycap clears.
module cap_opening() {
    translate([0, 0, -recess_depth])
        cylinder(h = flange_t + recess_depth + 6, d = cap_open_d);
}

// Front index notch (faces the user / thumb side, +Y).
module front_notch() {
    translate([0, flange_od/2, flange_t/2])
        cube([notch_w, notch_d*2, flange_t + 0.2], center = true);
}

// ---------------- Assembly ----------------
module plug() {
    difference() {
        // hollow shell but RETAIN the tilted switch plate
        difference() {
            outer_solid();
            difference() {
                inner_void();
                plate_keepout();
            }
        }
        switch_cutouts();
        cap_opening();
        front_notch();
    }
}

plug();
