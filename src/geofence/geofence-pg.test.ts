import { Client, Pool } from 'pg';
import { GeofencePostGIS } from '.';
import { data } from './geofence.fixtures';

jest.setTimeout(30000);

const createTestDatabase = async () => {
    const client = new Client({ connectionString: process.env.POSTGIS_URI });
    try {
        await client.connect();
        await client.query('CREATE DATABASE test_db_geofence;');
        return true;
    } catch (error) {
        return false;
    } finally {
        await client.end();
    }
};

const createTestTable = async () => {
    const client = new Client({
        connectionString: `${
            process.env.POSTGIS_URI as string
        }/test_db_geofence`,
    });
    try {
        await client.connect();
        await client.query('CREATE EXTENSION postgis;');
        await client.query(
            'CREATE TABLE geofence (geometries Geometry(Polygon, 4326), id SERIAL PRIMARY KEY);'
        );
        return true;
    } catch (error) {
        return false;
    } finally {
        await client.end();
    }
};

const dropTestDatabase = async () => {
    const client = new Client({ connectionString: process.env.POSTGIS_URI });
    try {
        await client.connect();
        await client.query('DROP DATABASE test_db_geofence;');
        return true;
    } catch (error) {
        return false;
    } finally {
        await client.end();
    }
};

const GeofencePostGISFactory = (pool: Pool): GeofencePostGIS => {
    const geofence = new GeofencePostGIS(pool, 'geofence');

    return geofence;
};

describe('GeofencePostGIS Test', () => {
    const pool = new Pool({
        connectionString: `${
            process.env.POSTGIS_URI as string
        }/test_db_geofence`,
    });
    const geofence = GeofencePostGISFactory(pool);

    const {
        features: [feature1, feature2],
    } = data;

    beforeAll(async () => {
        await createTestDatabase();
        await createTestTable();
        await geofence.init(data);
    });
    afterAll(async () => {
        await geofence.shutdown();
        await dropTestDatabase();
    });

    test("Point isn't inside any polygon", async () => {
        const result = await geofence.set([
            13.414188623428345, 52.52177986340841,
        ]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });

    test('Point is inside two polygons', async () => {
        const result = await geofence.set([
            13.413276672363281, 52.52185167207047,
        ]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2],
        });
    });

    test('Point is inside one polygon', async () => {
        const result = await geofence.set([
            13.412590026855469, 52.521812503723915,
        ]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });
    });

    test("Point isn't inside any polygon", async () => {
        const result = await geofence.set([
            13.411876559257507, 52.52180597566276,
        ]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });
});
