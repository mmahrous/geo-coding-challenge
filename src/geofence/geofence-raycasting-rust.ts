import {
    FeatureCollection,
    Polygon,
    GeoJsonProperties,
    Position,
} from '@vpriem/geojson';
import { GeofenceInterface } from './geofence-interface';

import { is_point_in_polygon } from './raycasting-rust';

export class GeofenceRayCastingRust implements GeofenceInterface {
    /**
     * This Geofence interface uses ray casting algorithm
     * https://en.wikipedia.org/wiki/Point_in_polygon
     * implmented in rust using neon bindings
     * https://neon-bindings.com/
     */
    featurecollection: FeatureCollection<Polygon, GeoJsonProperties>;

    init(data: FeatureCollection<Polygon, GeoJsonProperties>): void {
        this.featurecollection = data;
    }

    set(position: Position): FeatureCollection<Polygon> {
        const features: FeatureCollection<Polygon> = {
            type: 'FeatureCollection',
            features: [],
        };
        for (const polygon of this.featurecollection.features) {
            if (is_point_in_polygon(position, polygon)) {
                features.features.push(polygon);
            }
        }
        return features;
    }

    shutdown(): void {
        this.featurecollection = {
            type: 'FeatureCollection',
            features: [],
        };
    }
}
