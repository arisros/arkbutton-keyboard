linear_extrude(3) projection(cut=false) import("plate_flat.stl");
for (x=[70,75,80,83,85]) color("red") translate([x,0,3]) cube([0.8,180,3],center=true);
color("green") translate([0,0,3]) cube([180,0.8,3],center=true);  // Y=0 line
