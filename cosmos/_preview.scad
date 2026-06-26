// Exploded assembly preview: bowl (coakan) + I/O block + bottom plate.
E = 45;  // explode distance
color([0.62,0.62,0.64]) import("case_main.stl");                       // bowl with coakan
color([1,0.55,0.05])   translate([0, E*0.7, E]) import("block.scad");  // block lifted out
color([0.25,0.7,0.35]) translate([0,0,-3.2-E*0.5]) import("cosmotyl-plateright.stl"); // plate dropped
