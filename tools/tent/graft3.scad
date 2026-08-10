union(){
  import("flat_plate.stl");                                   // our plate = seal (correct outline)
  intersection(){                                             // keep intbottom bracket ONLY within our outline
    import("flat_intbottom.stl");
    linear_extrude(height=400,center=true) offset(delta=1) projection(cut=false) import("flat_plate.stl");
  }
}
