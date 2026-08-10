// Charybdis 6-thumb — iteration 2: fill the FULL trackball + 3-key thumb pod.
$fn=48;
CASE="/Users/arisjirat/keyboard-project/Charybdis/files/4x6/MK2/charybdis_v4_247_right.stl";
TB=[114,63];
skirt_bot=20; plate_top=41;
keys=[[-17,-8],[2,-2],[20,-7]];      // pitch ~19-20, slight arc

module socket_cut(){
  translate([0,0,-15]) cube([14,14,40],center=true);
  translate([0,0,-2.5]) cube([19,19,2.0],center=true);
  for(p=[[-3.81,2.54],[2.54,5.08]]) translate([p[0],p[1],-15]) cylinder(h=40,d=3,$fn=16);
}
module pod(){
  union(){
    translate([116,65,skirt_bot]) cylinder(h=plate_top-skirt_bot, d=47);   // fills whole trackball
    hull() for(k=keys) translate([TB[0]+k[0],TB[1]+k[1],skirt_bot]) cylinder(h=plate_top-skirt_bot, r=11); // key bridge
  }
}
difference(){
  union(){ import(CASE, convexity=10); pod(); }
  for(k=keys) translate([TB[0]+k[0],TB[1]+k[1],plate_top]) socket_cut();
}
