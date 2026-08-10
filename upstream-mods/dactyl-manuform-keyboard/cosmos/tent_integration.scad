// Integration check: tent module placed onto the real plate (right half).
// Verifies the bracket's 2 holes land on the inner-edge bosses.
include <BOSL2/std.scad>
use <tent_module.scad>
$fn = 32;

// inner-edge bosses (from plateright STL)
A = [-54.53, -13.11];
B = [-47.22,  61.11];
// bracket-local holes are at (7, +-37.29); axis along +Y, pin at x=0.
// transform: rotate about Z by phi, then translate, to map holes->bosses.
phi = -5.62;                 // deg
Tx = -57.845; Ty = 24.686; Tz = -6;   // -6 = bar_h, sits under plate bottom

module placed(angle = 25) {
  translate([Tx, Ty, Tz]) rotate([0, 0, phi]) {
    color("SteelBlue") bracket();
    color("Orange") rotate([0, -angle, 0]) foot();
  }
}

// the real plate
color("Gray") import("../../cosmos/cosmotyl-plateright.stl");

// debug: red pins at the two target bosses
color("Red") for (p = [A, B]) translate([p[0], p[1], -8]) cylinder(d = 2, h = 16);

placed(25);
