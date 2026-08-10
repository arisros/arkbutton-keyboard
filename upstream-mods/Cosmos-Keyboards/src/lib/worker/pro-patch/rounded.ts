import type { Cuttleform } from '../config'
import type { Curve, Line, WallCriticalPoints } from '../geometry'
import type { Vector } from '../modeling/transformation'
import type Trsf from '../modeling/transformation'

// ---------------------------------------------------------------------------
// Open re-implementation of Cosmos's "rounded" case (a Pro feature).
//
// SIDES: replace each straight outline segment b->c with a cubic Bezier whose
//   handles come from neighbours a,b,c,d (Catmull-Rom -> Bezier). `divisor`
//   = tension (smaller = rounder), `concavity` = how far handles pull.
//
// TOP: keep the non-rounded outer surface's 3-line structure & flags (so the
//   side-rounding loft invariant in joinedWall holds) but make ti->to and
//   to->mo tangent (G1) at the `to` corner to fillet the top edge.
// ---------------------------------------------------------------------------

function lerp(a: Trsf, b: Trsf, t: number): Trsf {
  const A = a.origin(), B = b.origin()
  const p = A.clone().multiplyScalar(1 - t).addScaledVector(B, t)
  return a.cleared().translate(p.x, p.y, p.z)
}

function straight(a: Trsf, b: Trsf): Curve {
  return [a, lerp(a, b, 1 / 3), lerp(a, b, 2 / 3), b]
}

// Same positional flag order as geometry.makeLine: (aNRoundPrev, aNRoundNext,
// bNRoundPrev, bNRoundNext) — note the names are intentionally "swapped".
function line(a: Trsf, b: Trsf, wall: WallCriticalPoints, curve?: Curve, aNRoundPrev = false, aNRoundNext = false, bNRoundPrev = false, bNRoundNext = false): Line {
  return { a, b, aNRoundNext, aNRoundPrev, bNRoundNext, bNRoundPrev, curve: curve ?? straight(a, b), wall }
}

// ---- SIDE rounding ----
function roundedControlPoints(conf: Cuttleform, a: Trsf, b: Trsf, c: Trsf, d: Trsf): Curve {
  const divisor = conf.rounded.side?.divisor ?? 3
  const concavity = conf.rounded.side?.concavity ?? 1.5
  const k = concavity / (divisor * 2)
  const A = a.origin(), B = b.origin(), C = c.origin(), D = d.origin()
  const p1 = B.clone().add(C.clone().sub(A).multiplyScalar(k))
  const p2 = C.clone().sub(D.clone().sub(B).multiplyScalar(k))
  const P1 = b.cleared().translate(p1.x, p1.y, p1.z)
  const P2 = c.cleared().translate(p2.x, p2.y, p2.z)
  return [b, P1, P2, c]
}

export function wallBezier(conf: Cuttleform, a: Trsf, b: Trsf, c: Trsf, d: Trsf, _wb: WallCriticalPoints, _wc: WallCriticalPoints, _worldZ: Vector, _bottomZ: number): [Trsf, Trsf, Trsf, Trsf] {
  return roundedControlPoints(conf, a, b, c, d)
}

export function wallCurveRounded(conf: Cuttleform, a: Trsf, b: Trsf, c: Trsf, d: Trsf, _wb: WallCriticalPoints, _wc: WallCriticalPoints, _worldZ: Vector, _bottomZ: number): Curve {
  return roundedControlPoints(conf, a, b, c, d)
}

// ---- TOP rounding (fillet the `to` corner; structure/flags == non-rounded) ----
export function wallSurfacesOuterRoundedTop(c: Cuttleform, wall: WallCriticalPoints): Line[] {
  const { ti, to, mo, bo } = wall
  const v = c.rounded.top!.vertical
  const tiO = ti.origin(), toO = to.origin(), moO = mo.origin()
  const T = toO.clone().sub(tiO).normalize().add(moO.clone().sub(toO).normalize()).normalize()
  const d = Math.min(toO.distanceTo(tiO), toO.distanceTo(moO)) * Math.min(v, 0.9)
  const P = toO.clone().addScaledVector(T, -d)
  const Q = toO.clone().addScaledVector(T, d)
  const topCurve: Curve = [ti, lerp(ti, to, 0.5), to.cleared().translate(P.x, P.y, P.z), to]
  const sideCurve: Curve = [to, to.cleared().translate(Q.x, Q.y, Q.z), lerp(to, mo, 0.5), mo]

  if (c.shell.type === 'basic' && c.shell.embedded) {
    const boLow = bo.translated(0, 0, -c.plateThickness)
    return [
      line(ti, to, wall, topCurve, wall.nRoundNext, wall.nRoundPrev, false, false),
      line(to, mo, wall, sideCurve),
      line(mo, boLow, wall),
    ]
  }
  return [
    line(ti, to, wall, topCurve, wall.nRoundNext, wall.nRoundPrev, false, false),
    line(to, mo, wall, sideCurve),
    line(mo, bo, wall),
  ]
}

export function wallSurfacesInnerRoundedTop(c: Cuttleform, wall: WallCriticalPoints): Line[] {
  // Interior surface kept straight; flags copied verbatim from wallSurfacesInner.
  const { ti, bo, bi, mi, ki } = wall
  if (c.shell.type === 'basic' && c.shell.embedded) {
    const boLow = bo.translated(0, 0, -c.plateThickness)
    const biLow = bi.translated(0, 0, -c.plateThickness)
    return [
      line(boLow, biLow, wall),
      line(biLow, bi, wall),
      line(bi, mi, wall),
      line(mi, ki, wall, undefined, false, false, wall.nRoundNext, wall.nRoundPrev),
      line(ki, ti, wall, undefined, wall.nRoundNext, wall.nRoundPrev, wall.nRoundNext, wall.nRoundPrev),
    ]
  }
  return [
    line(bo, bi, wall),
    line(bi, mi, wall),
    line(mi, ki, wall, undefined, false, false, wall.nRoundNext, wall.nRoundPrev),
    line(ki, ti, wall, undefined, wall.nRoundNext, wall.nRoundPrev, wall.nRoundNext, wall.nRoundPrev),
  ]
}
