module flat(){ rotate([90,0,0]) rotate([0,0,-29.6]) children(); }
color("Orange")           flat() import("newplate_RIGHT.stl",convexity=10);
color([0.55,0.55,0.62,0.4]) flat() import("dep2/cover.stl",convexity=10);
