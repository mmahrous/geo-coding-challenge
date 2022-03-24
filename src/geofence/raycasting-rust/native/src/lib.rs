use neon::prelude::*;

fn is_point_in_polygon(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let position: Handle<JsArray> = cx.argument(0)?;
    let polygon: Handle<JsObject> = cx.argument(1)?;

    let position_vec: Vec<Handle<JsValue>> = position.to_vec(&mut cx)?;

    let x_h: Handle<JsNumber> = position_vec[0].downcast_or_throw(&mut cx)?;
    let x: f64 = x_h.value();
    let y_h: Handle<JsNumber> = position_vec[1].downcast_or_throw(&mut cx)?;
    let y: f64 = y_h.value();

    let mut is_in: bool = false;

    let geometry: Handle<JsObject> = polygon.get(&mut cx, "geometry")?;
    let coordinates: Handle<JsArray> = geometry.get(&mut cx, "coordinates")?;

    let coord_length: u32 = coordinates.len();

    for i in 0..coord_length {
        let coordinate: Handle<JsArray> = coordinates.get(&mut cx, i)?;
        let n: u32 = coordinate.len() - 1;
        for j in 0..n {
            let this_coordinate: Handle<JsArray> = coordinate.get(&mut cx, j)?;
            let this_coordinate_vec: Vec<Handle<JsValue>> = this_coordinate.to_vec(&mut cx)?;

            let next_coordinate: Handle<JsArray> = coordinate.get(&mut cx, j+1)?;
            let next_coordinate_vec: Vec<Handle<JsValue>> = next_coordinate.to_vec(&mut cx)?;

            let x1_h: Handle<JsNumber> = this_coordinate_vec[0].downcast_or_throw(&mut cx)?;
            let x1: f64 = x1_h.value();
            let x2_h: Handle<JsNumber> = next_coordinate_vec[0].downcast_or_throw(&mut cx)?;
            let x2: f64 = x2_h.value();
            let y1_h: Handle<JsNumber> = this_coordinate_vec[1].downcast_or_throw(&mut cx)?;
            let y1: f64 = y1_h.value();
            let y2_h: Handle<JsNumber> = next_coordinate_vec[1].downcast_or_throw(&mut cx)?;
            let y2: f64 = y2_h.value();

            if ((y < y1) != (y < y2)) && x < (((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
                is_in = !is_in;
            }
        }
        if !!!is_in {
            break;
        }
    }

    Ok(cx.boolean(is_in))
}

register_module!(mut cx, {
    cx.export_function("is_point_in_polygon", is_point_in_polygon)
});
