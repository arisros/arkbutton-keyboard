$fn=36;
top=[[163.49,12.51,-60],[78.65,61.49,24],[149.64,20.51,20],[87.31,56.5,-54],[127.13,33.5,-42]];
difference(){
  import("/Users/arisjirat/keyboard-project/tools/tent/plate.stl",convexity=10);
  for(p=top) translate(p) rotate(a=90,v=[-0.869,0.494,0]) translate([0,0,-1.5]) cylinder(d=8.3,h=1.6);
}
