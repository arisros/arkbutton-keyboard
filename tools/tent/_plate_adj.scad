N=[0.494,0.869,0]; Ctop=[105.5,45.8,-5.5]; kbctr_=[2.4,9.0,-4.0];
holes=[[-46.2,40.7],[-44.7,-8.9],[-36.7,68.2],[-8.3,-32.1],[12.3,82.8],[69.2,-13.7],[69.6,68.4]];
module placeShift(gap=0) translate([Ctop[0]+N[0]*gap,Ctop[1]+N[1]*gap,Ctop[2]+N[2]*gap]) rotate([0,0,-29.6]) rotate([-90,0,0]) translate([-kbctr_[0],-kbctr_[1],-kbctr_[2]]) children();
difference(){ import("plate.stl",convexity=10);
  placeShift(0) for(h=holes) translate([h[0],h[1],-30]) cylinder(h=60,d=4.5,$fn=28); }
