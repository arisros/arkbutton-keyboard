EXPLODE=35;
color([0.62,0.62,0.64]) import("case_main.stl");
color([1,0.55,0.05]) translate([0,EXPLODE,0]) import("case_chunk.stl");
// axes at connector origin (-14,92.8,3): X=red +X arrow, Y=green, Z=blue
translate([-14,92.8,3]){
  color([1,0,0]) rotate([0,90,0]) cylinder(h=40,d=2);   // +X
  color([1,0,0]) translate([40,0,0]) sphere(3);          // +X tip
  color([0,0,1]) cylinder(h=30,d=2);                     // +Z
  color([1,1,0]) translate([-14,0,0]) sphere(2.5);       // mark x=-28
  color([0,1,1]) translate([14,0,0]) sphere(2.5);        // mark x=0
}
