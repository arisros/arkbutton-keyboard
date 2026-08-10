$fn=32;
pk=[[88.53,-119.35],[44.88,2.09],[114.17,-41.89],[15.03,-70.66],[60.93,-82.95]];
module printstl() import("/Users/arisjirat/keyboard-project/tools/tent/plate_mag_RIGHT_print.stl", convexity=12);
module solidbody()
  linear_extrude(height=3.0)
    offset(-15) offset(15)
      projection(cut=true)
        translate([0,0,-0.7]) printstl();
difference(){
  union(){ printstl(); solidbody(); }
  for(p=pk) translate([p[0],p[1],-0.02]) cylinder(d=8.3,h=1.5);
}
