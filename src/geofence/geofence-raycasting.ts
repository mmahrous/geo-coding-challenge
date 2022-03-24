import {
    FeatureCollection,
    Polygon,
    GeoJsonProperties,
    Position,
    Feature,
} from '@vpriem/geojson';
import { GeofenceInterface } from './geofence-interface';

export class GeofenceRayCasting implements GeofenceInterface {
    /**
     * This Geofence interface uses ray casting algorithm
     * https://en.wikipedia.org/wiki/Point_in_polygon
     */
    featurecollection: FeatureCollection<Polygon, GeoJsonProperties>;

    init(data: FeatureCollection<Polygon, GeoJsonProperties>): void {
        this.featurecollection = data;
    }

    private is_point_in_polygon(
        position: Position,
        polygon: Feature<Polygon>
    ): boolean {
        const x: number = position[0];
        const y: number = position[1];

        let is_in = false;

        for (let i = 0; i < polygon.geometry.coordinates.length; i++) {
            const n: number = polygon.geometry.coordinates[i].length;
            for (let j = 0; j < n - 1; j++) {
                const x1: number = polygon.geometry.coordinates[i][j][0];
                const x2: number = polygon.geometry.coordinates[i][j + 1][0];
                const y1: number = polygon.geometry.coordinates[i][j][1];
                const y2: number = polygon.geometry.coordinates[i][j + 1][1];

                if (
                    y < y1 != y < y2 &&
                    x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1
                ) {
                    is_in = !is_in;
                }
            }
            // not inside the outer shell or
            // outside an hole don't check the rest
            if (!is_in) {
                break;
            }
        }

        return is_in;
    }

    set(position: Position): FeatureCollection<Polygon> {
        const features: FeatureCollection<Polygon> = {
            type: 'FeatureCollection',
            features: [],
        };
        for (const polygon of this.featurecollection.features) {
            if (this.is_point_in_polygon(position, polygon)) {
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
