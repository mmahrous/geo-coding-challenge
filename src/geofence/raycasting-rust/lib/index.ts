/* eslint-disable */

import { Position, Feature, Polygon } from '@vpriem/geojson';

var addon = require('../native');

export function is_point_in_polygon(
    position: Position,
    polygon: Feature<Polygon>
): boolean {
    return addon.is_point_in_polygon(position, polygon);
}
