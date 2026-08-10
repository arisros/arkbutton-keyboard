// Tenting cover RIGHT — seal plate + hinged intbottom, flat pose, case_RIGHT_up frame.
// Derived: final_cover_dl/final_intbottom_dl un-tilted (rotY -30.05, rotX -0.15) then
// registered to plate_RIGHT in-case position (IoU 0.9989 vs plate outline).
module posed(f) {
  translate([58.55,10.45,-11.25]) rotate([-0.15,0,0]) rotate([0,-30.05,0]) import(f, convexity=10);
}
union(){
  posed("final_cover_dl.stl");
  posed("final_intbottom_dl.stl");
}
