// Horizontal cross-section at connector height to reveal the back-wall notch.
Z = 8;
projection(cut = true) translate([0,0,-Z]) import("case_main.stl");
// overlay box B outline (the coakan) as a reference rectangle
color([1,0,0]) translate([(-12+30)/2,(78+104)/2]) square([42,26], center=true);
