import Trsf from '$lib/worker/modeling/transformation-ext'
type Options = any; type Key = any;
// eslint-disable
const options: Options = {
  wallThickness: 4,
  wallShrouding: 0,
  wallXYOffset: 1,
  wallZOffset: 2,
  webThickness: 0,
  webMinThicknessFactor: 0.8,
  verticalClearance: 0.1,
  plateThickness: 3,
  keyBasis: "xda",
  screwIndices: [-1, -1, -1, -1, -1, -1, -1],
  screwCountersink: true,
  screwSize: "M3",
  screwType: "screw insert",
  clearScrews: true,
  rounded: { side: { divisor: 3, concavity: 1.5 }, top: { horizontal: 0.25, vertical: 0.67 } },
  connectors: [
    { preset: "trrs" },
    { preset: "usb", size: "average" }
  ],
  connectorIndex: -1,
  microcontroller: "waveshare-rp2040-zero",
  microcontrollerAngle: 0,
  fastenMicrocontroller: true,
  flipConnectors: false,
  wristRestOrigin: new Trsf().translate(10, -110, 0),
  shell: {
    type: "basic",
    lip: false,
    embedded: false
  }
}
// NOTE: Screws / the connector with
// negative indices are placed automatically.
// In the basic/advanced tab, these values were:
// [left] screwIndices: [8.5, 42.5, 18.5, 25.5, 2.5, 13.5, 28.5]
// [left] connectorIndex: 36
// [right] screwIndices: [8.5, 42.5, 18.5, 25.5, 2.5, 13.5, 28.5]
// [right] connectorIndex: 36

/**
 * The planes used to position the clusters.
 * It's rotated by the tenting and x rotation
 */
const rightFingersPlane = new Trsf()
  .rotate(1.0222222222222221, [0, 0, 0], [1, 0, 0], false)
  .rotate(0, [0, 0, 0], [0, 1, 0], false)   // base tilt 0 (flat = thinnest); pinky-down tilt comes from the tent stand (height-neutral)
  .rotate(0.2222222222222222, [0, 0, 0], [0, 0, 1], false)
  .translate(18, 35.6, -15.2)

const rightThumbsPlane = new Trsf()
  .rotate(12, [0, 0, 0], [1, 0, 0])   // thumb forward tilt: 20 -> 12 (flatter / proper, lowers case)
  .rotate(12.355555555555556, [0, 0, 0], [0, 1, 0])
  .rotate(-47.28888888888889, [0, 0, 0], [0, 0, 1])
  .translate(-39.9, -33, -8)
  .transformBy(new Trsf()
    .translate(-18, -35.6, 15.2)
    .rotate(-0.2222222222222222, [0, 0, 0], [0, 0, 1])
    .rotate(0, [0, 0, 0], [0, 1, 0])
    .rotate(-1.0222222222222221, [0, 0, 0], [1, 0, 0])
  )
  .transformBy(new Trsf()
    .rotate(1.0222222222222221, [0, 0, 0], [1, 0, 0], false)
    .rotate(0, [0, 0, 0], [0, 1, 0], false)
    .rotate(0.2222222222222222, [0, 0, 0], [0, 0, 1], false)
    .translate(18, 35.6, -15.2)
  )

const leftFingersPlane = new Trsf()
  .rotate(1.0222222222222221, [0, 0, 0], [1, 0, 0], false)
  .rotate(0, [0, 0, 0], [0, 1, 0], false)
  .rotate(-0.2222222222222222, [0, 0, 0], [0, 0, 1], false)
  .translate(-18, 35.6, -15.2)

const leftThumbsPlane = new Trsf()
  .rotate(20, [0, 0, 0], [1, 0, 0])
  .rotate(-12.355555555555556, [0, 0, 0], [0, 1, 0])
  .rotate(47.28888888888889, [0, 0, 0], [0, 0, 1])
  .translate(39.9, -33, -8)
  .transformBy(new Trsf()
    .translate(18, -35.6, 15.2)
    .rotate(0.2222222222222222, [0, 0, 0], [0, 0, 1])
    .rotate(0, [0, 0, 0], [0, 1, 0])
    .rotate(-1.0222222222222221, [0, 0, 0], [1, 0, 0])
  )
  .transformBy(new Trsf()
    .rotate(1.0222222222222221, [0, 0, 0], [1, 0, 0], false)
    .rotate(0, [0, 0, 0], [0, 1, 0], false)
    .rotate(-0.2222222222222222, [0, 0, 0], [0, 0, 1], false)
    .translate(-18, 35.6, -15.2)
  )


/** Definitions for all keys. */
const fingersLeft: Key[] = [
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "1",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "q",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "a",
      home: "pinky",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "z",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "2",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "w",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "s",
      home: "ring",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "x",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: 2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "]",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "3",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "e",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "d",
      home: "middle",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "c",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "[",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "4",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "r",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "f",
      home: "index",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "v",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "5",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "t",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "g",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "b",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 1, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 2, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      home: "pinky",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(leftFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 4, profile: "xda" }
  }
]

const thumbsLeft: Key[] = [
  {
    type: "mx-hotswap",
    aspect: 1.5,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-3, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(-156, [0, 0, 0], [0, 0, 1])
      .translate(13.4, 17.1, -0.1)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      home: "thumb",
      row: 5,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1.5,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-3, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(-156, [0, 0, 0], [0, 0, 1])
      .translate(-1.3, 33.7, -0.1)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-5.977777777777778, [0, 0, 0], [1, 0, 0])
      .rotate(5, [0, 0, 0], [0, 1, 0])
      .rotate(-95, [0, 0, 0], [0, 0, 1])
      .translate(15.1, -6, 0)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-13.977777777777778, [0, 0, 0], [1, 0, 0])
      .rotate(4, [0, 0, 0], [0, 1, 0])
      .rotate(-101, [0, 0, 0], [0, 0, 1])
      .translate(-11.3, 1.1, 1.3)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-10, [0, 0, 0], [1, 0, 0])
      .rotate(4, [0, 0, 0], [0, 1, 0])
      .rotate(-105, [0, 0, 0], [0, 0, 1])
      .translate(4, -24.9, -0.4)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-21, [0, 0, 0], [1, 0, 0])
      .rotate(2, [0, 0, 0], [0, 1, 0])
      .rotate(-106, [0, 0, 0], [0, 0, 1])
      .translate(-18.4, -18.4, -0.6)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  }
]

const fingersRight: Key[] = [
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "0",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "p",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: ";",
      home: "pinky",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "/",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "9",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "o",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "l",
      home: "ring",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: ".",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: 2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "]",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "8",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "i",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "k",
      home: "middle",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: ",",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "[",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "7",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "u",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "j",
      home: "index",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "m",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: -2,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "6",
      row: 1,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: -1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "y",
      row: 2,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: 0,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "h",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: 1,
        spacingOfColumns: 21.5,
        spacingOfRows: 19.5,
        curvatureOfRow: 2,
        curvatureOfColumn: 7,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      letter: "n",
      row: 4,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -2,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 1, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 2, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      home: "pinky",
      row: 3,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 19.5,
        curvatureOfColumn: 7,
        arc: 0,
        columnForArc: 2.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 2.5,
        spacingOfColumns: 21.5,
        curvatureOfRow: 2
      })
      .transformBy(rightFingersPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 4, profile: "xda" }
  }
]

const thumbsRight: Key[] = [
  {
    type: "mx-hotswap",
    aspect: 1.5,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-3, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(156, [0, 0, 0], [0, 0, 1])
      .translate(-13.4, 17.1, -0.1)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: {
      home: "thumb",
      row: 5,
      profile: "xda"
    }
  },
  {
    type: "mx-hotswap",
    aspect: 1.5,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-3, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(156, [0, 0, 0], [0, 0, 1])
      .translate(1.3, 33.7, -0.1)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-5.977777777777778, [0, 0, 0], [1, 0, 0])
      .rotate(-5, [0, 0, 0], [0, 1, 0])
      .rotate(95, [0, 0, 0], [0, 0, 1])
      .translate(-15.1, -6, 0)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-13.977777777777778, [0, 0, 0], [1, 0, 0])
      .rotate(-4, [0, 0, 0], [0, 1, 0])
      .rotate(101, [0, 0, 0], [0, 0, 1])
      .translate(11.3, 1.1, 1.3)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-10, [0, 0, 0], [1, 0, 0])
      .rotate(-4, [0, 0, 0], [0, 1, 0])
      .rotate(105, [0, 0, 0], [0, 0, 1])
      .translate(-4, -24.9, -0.4)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  },
  {
    type: "mx-hotswap",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(-21, [0, 0, 0], [1, 0, 0])
      .rotate(-2, [0, 0, 0], [0, 1, 0])
      .rotate(106, [0, 0, 0], [0, 0, 1])
      .translate(18.4, -18.4, -0.6)
      .placeOnMatrix({
        column: 0,
        row: 0,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 2,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    variant: { hotswap: "Gateron", led: "North LED" },
    keycap: { row: 5, profile: "xda" }
  }
]

export default {
  left: {
    ...options,
    keys: [...fingersLeft, ...thumbsLeft],
  },
  right: {
    ...options,
    keys: [...fingersRight, ...thumbsRight],
  },
}
