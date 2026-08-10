translate([0,0,45]){
  import("../case_RIGHT_up.stl", convexity=5);
  translate([-181,0,0]) import("../plate_RIGHT_flat.stl", convexity=5);
  color("red") import("mag/mag_kb_flat.stl");
  color("black") import("mag/feet_kb.stl");
}
import("tentplate_RIGHT_orig.stl", convexity=5);
color("blue") import("mag/mag_tent_flat.stl");
