// Robust mesh boolean split of the full case STL.
// PART selects output: "main" = bowl with notch, "chunk" = raw I/O block.
PART = "main";   // override with -D PART=\"chunk\"

// Coakan box B (case STL frame). Connector openings at x -31..-7, z 3..11.
BX0=-36; BX1=8; BY0=72; BY1=106; BZ0=-2; BZ1=26;
module B(){ translate([BX0,BY0,BZ0]) cube([BX1-BX0, BY1-BY0, BZ1-BZ0]); }

if (PART=="main")  difference(){ import("cosmotyl-caseright.stl"); B(); }
else               intersection(){ import("cosmotyl-caseright.stl"); B(); }
