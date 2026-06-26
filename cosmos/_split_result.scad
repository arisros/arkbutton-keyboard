// Exploded view of the split result.
EXPLODE = 35;  // pull the I/O block out along +Y
color([0.62,0.62,0.64]) import("case_main.stl");
color([1,0.55,0.05]) translate([0,EXPLODE,0]) import("case_chunk.stl");
