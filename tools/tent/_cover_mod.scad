$fn=36;
mag=[[59.3,69.5],[-38.7,-14.5],[43.3,-10.5],[-28.7,63.5],[17.3,51.5]];
feet=[[-60.6,-43.1],[35,-12.4],[-45.4,68],[48.9,66.4]];
difference(){
  translate([-181,0,0]) import("../plate_RIGHT_flat.stl",convexity=10);
  for(m=mag)  translate([m[0],m[1],-4.01]) cylinder(d=8.3,h=1.5);
  for(f=feet) translate([f[0],f[1],-4.05]) cylinder(d=8,h=1.05);
}
