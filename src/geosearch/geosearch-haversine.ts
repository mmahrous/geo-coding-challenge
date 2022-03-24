import {
    FeatureCollection,
    Polygon,
    Point,
    GeoJsonProperties,
    Position,
} from '@vpriem/geojson';
import { GeosearchInterface } from './geosearch-interface';

export class GeosearchHaversine implements GeosearchInterface {
    /**
     * TODO: implement interface https://github.com/TheAlgorithms/Javascript/blob/master/Navigation/Haversine.js
     */
    featurecollection: FeatureCollection<Polygon | Point, GeoJsonProperties>;
    earthRadius: number;
    pi: number;

    init(data: FeatureCollection<Polygon | Point, GeoJsonProperties>): void {
        this.featurecollection = data;
        this.earthRadius = 6371e3; // 6,371km
        this.pi = Math.PI;
    }

    private distance_between_two_points(
        position_1: Position,
        position_2: Position
    ): number {
        const cos1 = (position_1[1] * this.pi) / 180.0;
        const cos2 = (position_2[1] * this.pi) / 180.0;
        const deltaLatitude =
            ((position_2[1] - position_1[1]) * this.pi) / 180.0;
        const deltaLongitude =
            ((position_2[0] - position_1[0]) * this.pi) / 180.0;

        const alpha =
            Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.cos(cos1) *
                Math.cos(cos2) *
                Math.sin(deltaLongitude / 2) *
                Math.sin(deltaLongitude / 2);
        const constant = 2 * Math.atan2(Math.sqrt(alpha), Math.sqrt(1 - alpha));

        return this.earthRadius * constant;
    }

    find(
        position: Position,
        radius: number
    ): FeatureCollection<Polygon | Point, GeoJsonProperties> {
        const features: FeatureCollection<Polygon | Point> = {
            type: 'FeatureCollection',
            features: [],
        };

        for (const feature of this.featurecollection.features) {
            if (feature.geometry.type === 'Point') {
                if (
                    this.distance_between_two_points(
                        position,
                        feature.geometry.coordinates
                    ) < radius
                ) {
                    features.features.push(feature);
                }
            } else if (feature.geometry.type === 'Polygon') {
                if (
                    feature.geometry.coordinates[0].some(
                        (point) =>
                            this.distance_between_two_points(position, point) <
                            radius
                    )
                ) {
                    features.features.push(feature);
                }
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
