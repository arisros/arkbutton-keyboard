// SuperMini nRF52840 — FLAT HOLDER for Scylla (Elite-C-Holder 2.0 style).  v7 (2026-07-15)
// Flat plate rests on TWO case standoffs B + B2 (both collar-top y=7.29), screwed down (M3).
// The board is held on the plate's UNDERSIDE, component/USB side DOWN, so the USB-C drops to
// ~y4.4 and registers to the wall slot (21.26, 4.62). Case frame, Y-up.
$fn = 40;

// ---- measured case refs (STL) ----
usb    = [21.26, 4.62];    // USB-C slot centre
wall_z = -90.3;            // -Z outer wall
inner  = wall_z + 2.3;     // inner wall face (-88.0)
rest   = 7.29;             // standoff collar top (plate bottom rests here)
mB     = [7.62, -82.49];   // standoff B  (near wall)
mB2    = [42.26, -54.24];  // standoff B2 (deeper in)

// ---- board (SuperMini, user-measured 17.91 x 33.90) ----
bw = 18.3; bl = 34.3;      // + clearance
bx = usb[0] - bw/2;        // board left x  (USB centred on slot)
bz = inner;                // board USB edge at the inner wall
pt   = 3.0;                // plate thickness (v8: thicker = rigid, warps less)

// v8: SOLID plate, NO walls. Every wall/lip version failed at the SAME layer (plate->wall transition:
// thin isolated walls on a warp-prone thin plate). This version validates the MOUNT (fits + bolts to
// B+B2 + USB aligns) as a bulletproof solid plate; board retention added AFTER the mount is confirmed.
module flat_holder(){
  difference(){
    union(){
      // ---- plate: hull over the board area + the 2 mount tabs (SOLID, no walls) ----
      hull(){
        translate([bx-2,    rest, bz-1])    cube([bw+4, pt, bl+2]);   // over board
        translate([mB[0]-5, rest, mB[1]-5]) cube([10, pt, 10]);       // tab -> B
        translate([mB2[0]-5,rest, mB2[1]-5])cube([10, pt, 10]);       // tab -> B2
      }
    }
    // ---- 2x M3 screw holes (down through into the standoff inserts) ----
    translate([mB[0],  rest-1, mB[1]])  rotate([-90,0,0]) cylinder(d=3.4, h=pt+2);
    translate([mB2[0], rest-1, mB2[1]]) rotate([-90,0,0]) cylinder(d=3.4, h=pt+2);
    // ---- keep the USB edge open (board front pokes -Z to the wall) ----
    translate([usb[0]-7, rest-1, bz-4]) cube([14, pt+2, 5]);
  }
}
flat_holder();
