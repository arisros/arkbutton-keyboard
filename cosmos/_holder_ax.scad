color([0.3,0.55,1]) import("holder.stl");
// axis at connectorOrigin x=-14
translate([-14,92,3]){ color([1,0,0]) rotate([0,90,0]) cylinder(h=40,d=1.6,$fn=16);
  color([1,1,0]) translate([-14,0,0]) sphere(2,$fn=16);   // x=-28
  color([0,1,1]) translate([7,0,0]) sphere(2,$fn=16); }    // x=-7
