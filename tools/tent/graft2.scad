$fn=24;
union(){
  import("graft_plate_dl.stl");                 // cover (seals case)
  import("hinge_knuckles.stl");                  // hinge knuckles + arm boss (mate base)
  // bracket: hull the knuckles/arm region up to a slab under the cover edge
  hull(){
    import("hinge_knuckles.stl");
    translate([-37,3,30]) rotate([26,0,0]) cube([70,90,4],center=true);  // slab at cover underside (hinge edge)
  }
}
