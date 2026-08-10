// diagnostic: keyboard orientation + axes (red=+X, green=+Y)
color([.6,.6,.62]) import("../../cosmos/cosmotyl-caseright.stl");
color("red")   cube([110,5,5]);     // +X
color("green") cube([5,110,5]);     // +Y
color("red")   translate([110,0,0]) cylinder(d=10,h=0.1);
color("green") translate([0,110,0]) cylinder(d=10,h=0.1);
