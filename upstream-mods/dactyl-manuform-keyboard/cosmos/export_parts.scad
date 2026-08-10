// Export helper: render a single part for STL output.
//   openscad -o bracket.stl -D 'part="bracket"' export_parts.scad
//   openscad -o foot.stl    -D 'part="foot"'    export_parts.scad
include <BOSL2/std.scad>
use <tent_module.scad>
$fn = 48;
part = "bracket";
if (part == "bracket") bracket();
else if (part == "foot") foot();
