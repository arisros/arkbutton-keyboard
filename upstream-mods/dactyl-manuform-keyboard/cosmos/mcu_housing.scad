// Unified I/O housing = Cosmos board holder (RP2040-Zero USB-C + TRRS)
// + a reset tactile-switch mount. Mounts to the bottom cover via the 2 arms.
//   openscad -o ../../cosmos/holder_full.stl mcu_housing.scad
include <BOSL2/std.scad>
$fn = 24;

reset_pos = [-30, 86, 0];   // near the back connector opening; button faces +Y

union() {
  import("../../cosmos/holder.stl");                 // MCU cradle + TRRS dudukan
  translate(reset_pos) difference() {
    cuboid([10, 9, 8], anchor = BOTTOM, rounding = 1.2, edges = "Z");
    translate([0, 2.0, 4]) cube([6.4, 6.5, 5], center = true);  // 6mm tactile switch pocket
    translate([0, 6, 4]) ycyl(d = 3.8, h = 10);                 // button-access hole -> +Y (back)
  }
}
