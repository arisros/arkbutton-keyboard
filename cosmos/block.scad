// Removable I/O block ("potongan") for RP2040-Zero (USB-C) + TRRS + reset.
//  = outer wall panel (closes the coakan window 100% flush, = clean bowl ∩ box)
//  + Cosmos board holder (cradle + bolt tabs to plate)
//  + reset tactile-switch boss
//  - USB-C / TRRS / reset openings through the panel (facing +Y = out the back)
// Bolts DOWN to the bottom plate via the holder tabs. Reprint THIS part (not the
// bowl) when the microcontroller / connectors change.
//   openscad -o block.stl block.scad
include <BOSL2/std.scad>
$fn = 40;

// --- connector opening positions on the back panel (case STL frame) ----------
// FIRST-PASS estimates from connectorOrigin (x=-14) + axis-labelled render.
// Validate/adjust in the viewer.
TRRS = [-28, 7];   // [x, z] round jack
USB  = [-9,  7];   // [x, z] USB-C slot center
RST  = [-30, 12];  // [x, z] reset button access
YBACK = 96;        // panel mid-Y; holes are bored along Y through the wall

module boreY(x, z, len=24) translate([x, YBACK, z]) rotate([-90,0,0]) children();

module reset_boss() {
  translate([RST[0], 86, 0]) difference() {
    cuboid([10, 9, 12], anchor = BOTTOM, rounding = 1.2, edges = "Z");
    translate([0, 2.0, 6]) cube([6.4, 6.5, 6], center = true);  // 6mm tactile pocket
  }
}

difference() {
  union() {
    import("block_panel.stl");   // outer wall, closes window flush
    import("holder.stl");        // RP2040-Zero + TRRS cradle, bolt tabs
    reset_boss();
  }
  // openings through the panel (bored along Y, facing +Y back):
  boreY(TRRS[0], TRRS[1]) cylinder(d = 9.5, h = 24, center = true);                 // TRRS jack
  boreY(USB[0],  USB[1])  hull() { for (s=[-1,1]) translate([s*2.8,0,0]) cylinder(d=3.4, h=24, center=true); } // USB-C slot ~9x3.4
  boreY(RST[0],  RST[1])  cylinder(d = 4.0, h = 24, center = true);                 // reset access
}
