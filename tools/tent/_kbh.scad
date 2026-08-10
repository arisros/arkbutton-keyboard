pts=[[81.25,65.24,-47.16],[82.56,64.5,2.44],[89.51,60.55,-74.66],[114.21,46.52,25.64],[132.12,36.35,-89.26],[181.59,8.24,7.24],[181.94,8.04,-74.86]];
module ring() rotate(a=90,v=[-0.869,0.494,0]) difference(){ cylinder(d=9,h=1.2,center=true,$fn=32); cylinder(d=5.2,h=3,center=true,$fn=32); }
for(p=pts) translate(p) ring();
