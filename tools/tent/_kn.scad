// body base (low) in gray
color("Silver") intersection(){ import("plate_solid_RIGHT_print.stl",convexity=12); translate([-200,-200,-1]) cube([400,400,3.0]); }
// knuckles (tall features) in red
color("Tomato") intersection(){ import("plate_solid_RIGHT_print.stl",convexity=12); translate([-200,-200,3.0]) cube([400,400,20]); }
