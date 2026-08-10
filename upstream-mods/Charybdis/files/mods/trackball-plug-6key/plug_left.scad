/* Left-hand plug = X-mirror of the right plug.
 * The body is a revolution and the thumb tilt is purely toward the user (Y),
 * so the only thing the mirror fixes is the MX hotswap pin/LED orientation and
 * the socket slide-in mouth, so the switch sits electrically correct when the
 * case itself is mirrored for the left half. */
mirror([1, 0, 0]) import("plug_right.stl");
