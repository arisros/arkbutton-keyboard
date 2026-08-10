import("/Users/arisjirat/keyboard-project/tools/case_RIGHT_up.stl", convexity=5);
translate([-181,0,0]) import("/Users/arisjirat/keyboard-project/tools/plate_RIGHT_flat.stl", convexity=5);
color("red") import("mag/mag_kb_flat.stl");
translate([0,0,-2]) import("cover_tent_RIGHT.stl", convexity=5);
color("blue") translate([0,0,-2]) import("mag/mag_tent_flat.stl");
