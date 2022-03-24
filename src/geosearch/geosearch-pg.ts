import {
    FeatureCollection,
    Polygon,
    GeoJsonProperties,
    Position,
    Feature,
    Point,
} from '@vpriem/geojson';
import { Pool } from 'pg';

import { GeosearchInterface } from './geosearch-interface';

export class GeosearchPostGIS implements GeosearchInterface {
    /**
     * This Geofence interface uses PostGIS
     */
    pg_pool: Pool;
    table_name: string;

    constructor(pg_pool: Pool, table_name: string) {
        this.pg_pool = pg_pool;
        this.table_name = table_name;
    }

    private insert_fearure_sql(
        feature: Feature<Polygon | Point>,
        id: number
    ): string {
        return `INSERT INTO ${
            this.table_name
        } (geometries, id) VALUES (ST_TRANSFORM(ST_GeomFromGeoJSON('${JSON.stringify(
            feature.geometry
        )}'),4326), ${id});`;
    }

    async init(
        data: FeatureCollection<Polygon | Point, GeoJsonProperties>
    ): Promise<void> {
        await Promise.all(
            data.features.map((f, k) =>
                this.pg_pool.query(this.insert_fearure_sql(f, k + 1))
            )
        );
    }

    async find(
        position: Position,
        radius: number
    ): Promise<FeatureCollection<Polygon | Point, GeoJsonProperties>> {
        type rowType = {
            feature: Polygon | Point;
        };
        const { rows } = await this.pg_pool.query(`
            SELECT COALESCE(ST_AsGeoJSON(geometries, 20)::json, array_to_json('{}'::int[])) as feature
            FROM ${this.table_name}
            WHERE ST_DWithin(
                geometries::geometry, 
                ST_GeomFromText('POINT(${position.join(' ')})', 4326),
                ${radius},
                true
            )    
            ORDER BY id
        `);

        return {
            type: 'FeatureCollection',
            features: rows.map((row: rowType) => ({
                type: 'Feature',
                properties: {},
                geometry: row.feature,
            })),
        };
    }

    async shutdown(): Promise<void> {
        await this.pg_pool.end();
    }
}
