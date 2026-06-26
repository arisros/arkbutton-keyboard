// Preview: full case + candidate cut box B for the removable I/O block.
$fn = 32;

// candidate coakan box B (case STL frame, z=0 at floor)
BX0=-12; BX1=30;   // X span
BY0=78;  BY1=103;  // Y span (depth into back bump)
BZ0=-1;  BZ1=22;   // Z span (height)

color([0.6,0.6,0.62]) import("cosmotyl-caseright.stl");

// transparent red proposed cut volume
color([1,0,0,0.35])
  translate([BX0,BY0,BZ0])
    cube([BX1-BX0, BY1-BY0, BZ1-BZ0]);

// axis triad: X=red Y=green Z=blue, length 80, from origin
module arrow(v){ color(v==0?[1,0,0]:v==1?[0,1,0]:[0,0,1])
  rotate(v==0?[0,90,0]:v==1?[-90,0,0]:[0,0,0]) cylinder(h=80,d=3); }
arrow(0); arrow(1); arrow(2);
color([0,1,0]) translate([0,90,0]) sphere(5);   // +Y marker (back)
