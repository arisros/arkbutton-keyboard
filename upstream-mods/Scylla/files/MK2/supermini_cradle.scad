// SuperMini nRF52840 cradle for Scylla (no-trackball, handwired wireless).  v2 (2026-07-14)
// Designed in the Scylla CASE frame so USB-C registers to the measured slot.
// Measured (STL, 2026-07-14): -Z outer wall z=-90.3 (~2.3mm); USB-C slot (21.26,4.62) 9.75x3.5;
//   reset hole (37.18,4.43) ~5.25dia. Bottom-plate bolt bosses (dia~5.85, seat y=-1.96):
//   nearest-wall = C(-13.21,-82.92); secondary = F(45.10,-40.66).
// v2 changes vs v1: board pocket -> measured 17.91x33.90; reset button 4x4 -> 6x6 and pushed
//   FLUSH to the inner wall (closes the ~5mm gap user reported); + two mounting EARS (to boss C & F)
//   with oversized/slotted holes (tolerance) so USB slot is the primary alignment.
$fn = 40;

// ---- measured case refs ----
usb   = [21.26, 4.62];    // USB-C slot centre (x, y=height)
rst   = [37.18, 4.43];    // reset hole centre
wall_z = -90.3;           // -Z outer wall
wall_t = 2.3;             // wall thickness -> inner face
inner  = wall_z + wall_t; // board front butts here (-88.0)

// ---- SuperMini board (user-measured 17.91 x 33.90) ----
// v3 (2026-07-18): pocket was too tight (board jammed, un-removable). Loosened:
//   bw 18.3->18.9 (~0.5mm/side), bl 34.3->34.8, lip 1.2->0.6 so board slides out.
bw   = 18.9;              // width  + clearance (board 17.91, ~0.5mm/side)
bl   = 34.8;              // length + clearance (board 33.90)
bx0  = usb[0] - bw/2;     // board left x
by   = 2.8;              // PCB bottom height (USB-C centre ~4.6)
fl   = 1.5;              // cradle floor
rail = 1.6;             // side rail
lip  = 0.6;             // retaining lip over board top (light — removable)
railh = (usb[1]-by) + 2.2;  // rail height above floor (over the PCB)

// ---- reset push-button (6x6, user's tactile) held FLUSH to the inner wall ----
btn  = 6.4;              // 6x6 button + clearance
bdep = 3.6;              // button body depth along Z (front face sits at z=inner)
module reset_holder() {
  rx = rst[0];
  // floor arm linking the holder to the cradle's +x rail
  translate([usb[0]+bw/2+rail, by-fl, inner]) cube([rx-btn/2-1.2-(usb[0]+bw/2+rail), fl, bdep+1.2]);
  // floor under the button
  translate([rx-btn/2-1.2, by-fl, inner]) cube([btn+2.4, fl, bdep+1.2]);
  // back stop (+Z) so the button FRONT stays at z=inner (against the case wall) -> no gap
  translate([rx-btn/2-1.2, by-fl, inner+bdep]) cube([btn+2.4, fl+btn+1.6, 1.2]);
  // side walls (X) — open at top to drop the button in, open front (-Z) so actuator reaches the wall hole
  translate([rx-btn/2-1.2, by-fl, inner]) cube([1.2, fl+btn+1.6, bdep+1.2]);
  translate([rx+btn/2,     by-fl, inner]) cube([1.2, fl+btn+1.6, bdep+1.2]);
}

// ---- SINGLE mount -> boss B, the CLOSE boss (v4, 2026-07-18) ----
// User: use the nearer boss. B at x=7.62 is only ~2.6mm left of the cradle rail (rail left face
// x=bx0-rail). B collar-top y≈7.3 ≈ the rail TOP (y≈6.8), so a SHORT near-level tab off the rail
// top reaches it → minimal overhang. M3 screw down into B's insert.
mhc = 3.4;                              // M3 clearance
hbX = 7.62; hbZ = -82.50; hbT = 7.3;    // boss B (close, high collar ≈ rail top)
railTopY = (by-fl) + fl + railh;        // cradle rail top (~6.82)
module mount_tabB(){
  difference(){
    hull(){
      // root: grab the top of the left rail
      translate([bx0-rail, railTopY-3.5, hbZ-4.5]) cube([1.6, 3.5, 9]);
      // pad over boss B (top face at collar height)
      translate([hbX-4.5, hbT-2.2, hbZ-4.5]) cube([9, 2.2, 9]);
    }
    // counterbore so the boss post nests (d~5.9 up to collar) + M3 screw hole through the pad
    translate([hbX, -0.1, hbZ]) rotate([-90,0,0]) cylinder(d=6.6, h=hbT-0.6);
    translate([hbX, hbT-2.4, hbZ]) rotate([-90,0,0]) cylinder(d=mhc, h=4);
  }
}

module cradle() {
  difference() {
    union() {
      // floor under the board
      translate([bx0-rail, by-fl, inner]) cube([bw+2*rail, fl, bl]);
      // side rails
      translate([bx0-rail,        by-fl, inner]) cube([rail, fl+railh, bl]);
      translate([usb[0]+bw/2,     by-fl, inner]) cube([rail, fl+railh, bl]);
      // retaining lips (overhang the board top so it snaps in)
      translate([bx0-rail,            by-fl+railh, inner]) cube([rail+lip, 1.0, bl]);
      translate([usb[0]+bw/2-lip,     by-fl+railh, inner]) cube([rail+lip, 1.0, bl]);
      // back stop (board can't slide in past USB depth)
      translate([bx0-rail, by-fl, inner+bl-1.6]) cube([bw+2*rail, fl+railh+1, 1.6]);
      reset_holder();
      mount_tabB();  // single tab -> boss B (close)
    }
  }
}
cradle();
