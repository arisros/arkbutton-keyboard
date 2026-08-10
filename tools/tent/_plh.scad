w=91.9;
function P3(u,v)=[0.869*v+0.494*w, -0.494*v+0.869*w, u];
uv=[[-58.6,146.7],[-54.5,56.2],[-30.7,29.3],[10.8,27.9],[17.7,32.6],[23.1,147.4]];
module ring() rotate(a=90,v=[-0.869,0.494,0]) difference(){ cylinder(d=9,h=1.2,center=true,$fn=32); cylinder(d=5.2,h=3,center=true,$fn=32); }
for(h=uv) translate(P3(h[0],h[1])) ring();
