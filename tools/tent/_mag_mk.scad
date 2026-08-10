top=[[163.49,12.51,-60],[78.65,61.49,24],[149.64,20.51,20],[87.31,56.5,-54],[127.13,33.5,-42]];
module disc(d,h) rotate(a=90,v=[-0.869,0.494,0]) translate([0,0,-h/2]) cylinder(d=d,h=h,$fn=32);
for(p=top) translate(p) disc(8,1.5);
