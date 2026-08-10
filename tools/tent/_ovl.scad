module flat(){ rotate([90,0,0]) rotate([0,0,-29.6]) children(); }
color("Orange")             flat() import("plate.stl", convexity=5);
color([0.6,0.6,0.7,0.45])   flat() import("dep2/cover.stl", convexity=5);
