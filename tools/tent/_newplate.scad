N=[0.494,0.869,0]; Ctop=[121.1,36.9,-15.5]; kbctr=[2.4,9.0,-4.0];
holes=[[-46.2,40.7],[-44.7,-8.9],[-36.7,68.2],[-8.3,-32.1],[12.3,82.8],[69.2,-13.7],[69.6,68.4]];
module placeShift(gap=0)
  translate([Ctop[0]+N[0]*gap,Ctop[1]+N[1]*gap,Ctop[2]+N[2]*gap])
    rotate([0,0,-29.6]) rotate([-90,0,0]) translate([-kbctr[0],-kbctr[1],-kbctr[2]]) children();
module scyllaPlate() translate([-181,0,0]) import("../plate_RIGHT_flat.stl",convexity=10);
module slab(){ placeShift(0) scyllaPlate(); translate([-N[0]*2,-N[1]*2,-N[2]*2]) placeShift(0) scyllaPlate(); }
module drills() placeShift(0) for(h=holes) translate([h[0],h[1],-25]) cylinder(h=50,d=4.5,$fn=28);
difference(){
  union(){ import("plate.stl",convexity=10); slab(); }
  drills();
}
