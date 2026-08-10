$fn=24;
CASE="/Users/arisjirat/keyboard-project/Scylla/files/MK2/scylla_v3_36.stl";
endc=[16.5,32.5,47.5]; box=[43,55,33]; shift=[-17,-3,-4];
module case_(){ import(CASE, convexity=10); }
union(){ case_(); translate(shift) intersection(){ case_(); translate(endc) cube(box, center=true); } }
