import {
    FeatureCollection,
    Polygon,
    GeoJsonProperties,
    Position,
    Feature,
} from '@vpriem/geojson';
import { Pool } from 'pg';

import { GeofenceInterface } from './geofence-interface';

export class GeofencePostGIS implements GeofenceInterface {
    /**
     * This Geofence interface uses PostGIS
     */
    pg_pool: Pool;
    table_name: string;

    constructor(pg_pool: Pool, table_name: string) {
        this.pg_pool = pg_pool;
        this.table_name = table_name;
    }

    private insert_fearure_sql(feature: Feature<Polygon>, id: number): string {
        return `INSERT INTO ${
            this.table_name
        } (geometries, id) VALUES (ST_TRANSFORM(ST_GeomFromGeoJSON('${JSON.stringify(
            feature.geometry
        )}'),4326), ${id});`;
    }

    async init(
        data: FeatureCollection<Polygon, GeoJsonProperties>
    ): Promise<void> {
        await Promise.all(
            data.features.map((f, k) =>
                this.pg_pool.query(this.insert_fearure_sql(f, k + 1))
            )
        );
    }

    async set(position: Position): Promise<FeatureCollection<Polygon>> {
        type rowType = {
            feature: Polygon;
        };
        const { rows } = await this.pg_pool.query(`
            SELECT COALESCE(ST_AsGeoJSON(geometries, 20)::json, array_to_json('{}'::int[])) as feature
            FROM ${this.table_name}
            WHERE ST_Contains(
                geometries::geometry, 
                ST_GeomFromText('POINT(${position.join(' ')})', 4326)
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
