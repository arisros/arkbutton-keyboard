// =====================================================================
// Dynamic tenting module for the Cosmos Dactyl (right half) -- v3
// Bolts under the bottom plate at the two inner-edge M3 screw bosses.
// Hand-rolled interleaved knuckle hinge + foldable foot + pin lock.
//
// Boss data (cosmotyl-plateright.stl): inner-edge bosses
//   (-54.53,-13.11) & (-47.22,61.11) -> bolt spacing 74.58 mm.
// Pin axis = Y at origin. Foot deploys by yrot(-angle). Lock pin = M3,
// also along Y; bracket fan holes are placed exactly where the foot
// lever hole lands at each lock angle, so they always line up.
// =====================================================================
include <BOSL2/std.scad>
$fn = 48;

/* [Mount bar] */
hole_spacing = 74.58;
bar_w  = 14;
bar_h  = 6;
screw_clear = 3.4;
screw_head  = 6.2;

/* [Hinge] */
hinge_len = 70;
n_knk     = 7;
knuckle_r = 4;
pin_d     = 3.4;
gap       = 0.5;

/* [Foot] */
foot_reach = 60;
foot_w     = 52;
foot_t     = 5;

/* [Lock] */
lock_R      = 34;
lock_pin_d  = 3.4;
lock_angles = [10, 20, 30, 45];
hub_r       = 6;
fan_y0 = 35; fan_y1 = 42;    // bracket fan band (beyond foot)
lev_y0 = 27; lev_y1 = 34;    // foot lever band

seg = hinge_len / n_knk;

module knuckle(i) {
  yy = -hinge_len/2 + seg/2 + i*seg;
  back(yy) ycyl(d = knuckle_r*2, h = seg - gap);
}
module knuckles(parity)
  for (i = [0:n_knk-1]) if (i % 2 == parity) knuckle(i);

module pin_bore() ycyl(d = pin_d, h = hinge_len + 60);

// quarter-disk fan (in XZ plane): keep only the -X / -Z deploy quadrant
// (so it never sticks up into the keyboard plate above)
module fan(y0, y1, r) {
  yy = (y0+y1)/2; th = y1-y0;
  intersection() {
    back(yy) ycyl(d = 2*r, h = th);
    back(yy) translate([-(r+2)/2, 0, (3-r)/2])
      cube([r+2, th+2, r+3], center=true);   // keep x<=0 AND z<=3
  }
}

// ---- KEYBOARD-SIDE BRACKET ----
module bracket() {
  difference() {
    union() {
      right(bar_w/2) up(bar_h/2)
        cuboid([bar_w, hole_spacing + bar_w, bar_h], rounding = 1.5, edges = "Z");
      knuckles(0);
      // hub extending out to the fan band, + fan
      back((34+fan_y1)/2) ycyl(d = hub_r*2, h = fan_y1-34);
      fan(fan_y0, fan_y1, lock_R);
    }
    pin_bore();
    // lock holes: where the foot lever hole lands at each angle a
    for (a = lock_angles)
      back((fan_y0+fan_y1)/2) translate([-lock_R*cos(a), 0, -lock_R*sin(a)])
        ycyl(d = lock_pin_d, h = 20);
    // M3 mount holes at real boss spacing
    ycopies(spacing = hole_spacing)
      right(bar_w/2) {
        cyl(d = screw_clear, h = bar_h*3);
        up(bar_h - 1.6) cyl(d = screw_head, h = 4);
      }
  }
}

// ---- FOOT ----
module foot() {
  difference() {
    union() {
      knuckles(1);
      left(foot_reach/2) cuboid([foot_reach, foot_w, foot_t], rounding = 2, edges = "Z");
      // lever: hub -> arm to radius lock_R (hole at -X tip, angle 0)
      back((lev_y0+lev_y1)/2) ycyl(d = hub_r*2, h = lev_y1-lev_y0);
      hull() {
        back((lev_y0+lev_y1)/2) ycyl(d = hub_r*2, h = lev_y1-lev_y0);
        back((lev_y0+lev_y1)/2) left(lock_R) ycyl(d = 9, h = lev_y1-lev_y0);
      }
    }
    pin_bore();
    back((lev_y0+lev_y1)/2) left(lock_R) ycyl(d = lock_pin_d, h = 20); // lever hole
  }
}

// ---- ASSEMBLY ----
module assembly(angle = 30) {
  color("SteelBlue") bracket();
  color("Orange") yrot(-angle) foot();
}

// --- INTERACTIVE PREVIEW ---
// 1) Drag with the mouse to rotate / scroll to zoom.
// 2) To SIMULATE the foot opening: View menu -> Animate (or the "Animate"
//    bar at the bottom). Set  FPS = 24  and  Steps = 120 , then it loops:
//    the foot deploys 0 -> 45 deg and folds back, driven by $t below.
deploy_max = 45;
anim_angle = deploy_max * (1 - cos(360 * $t)) / 2;   // 0 -> 45 -> 0
assembly($t > 0 ? anim_angle : 30);                  // static view shows 30 deg
