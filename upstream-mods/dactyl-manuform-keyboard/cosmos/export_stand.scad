// Export helper for the tenting stand parts.
//   openscad -o stand_bottom.stl -D 'part="bottom"' export_stand.scad
//   openscad -o stand_top.stl    -D 'part="top"'    export_stand.scad
include <BOSL2/std.scad>
use <tent_stand.scad>
$fn = 28;
part = "bottom";
slot = 4;     // for the deployed assembly preview (which lock slot the leg seats in)
theta = 0;    // cover angle (deg) for the kinematic-sweep parts wcoverth / wlegth
if (part == "bottom") base();
else if (part == "top") cover_raw();
else if (part == "deployed") assembly(slot);   // base + tilted cover + leg seated (functional preview)
else if (part == "leg") leg_at_slot(slot);     // leg alone (overlay on base to verify foot enters slot)
else if (part == "folded") folded();           // cover folded flat on base (check flush close over slots)
// --- world-posed single parts (same frame) for the interference checker ---
// (these are MODULES in tent_stand.scad — `use` imports modules/functions but NOT top-level
//  variables like slot_xs, so the world poses must be built inside the module's own scope)
else if (part == "wcover")   world_cover(slot);   // cover in its deployed pose for this slot
else if (part == "wcover0")  world_cover_flat();  // cover folded flat
else if (part == "wlegfold") world_leg_fold();    // leg nested folded in the pocket
else if (part == "wcoverth") world_cover_th(theta);   // cover at sweep angle theta
else if (part == "wlegth")   world_leg_th(theta);     // leg lying on the base at sweep angle theta
