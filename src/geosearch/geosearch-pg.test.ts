import { Client, Pool } from 'pg';
import { GeosearchPostGIS } from '.';
import { data } from './geosearch.fixtures';

jest.setTimeout(30000);

const createTestDatabase = async () => {
    const client = new Client({ connectionString: process.env.POSTGIS_URI });
    try {
        await client.connect();
        await client.query('CREATE DATABASE test_db_geosearch;');
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
        }/test_db_geosearch`,
    });
    try {
        await client.connect();
        await client.query('CREATE EXTENSION postgis;');
        await client.query(
            'CREATE TABLE geosearch (geometries geometry, id SERIAL PRIMARY KEY);'
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
        await client.query('DROP DATABASE test_db_geosearch;');
        return true;
    } catch (error) {
        return false;
    } finally {
        await client.end();
    }
};

const GeosearchPostGISFactory = (pool: Pool): GeosearchPostGIS => {
    const geofence = new GeosearchPostGIS(pool, 'geosearch');

    return geofence;
};

describe('geosearch', () => {
    const pool = new Pool({
        connectionString: `${
            process.env.POSTGIS_URI as string
        }/test_db_geosearch`,
    });
    const geosearch = GeosearchPostGISFactory(pool);

    const {
        features: [feature1, feature2, feature3, point1, point2, point3],
    } = data;

    beforeAll(async () => {
        await createTestDatabase();
        await createTestTable();
        await geosearch.init(data);
    });
    afterAll(async () => {
        await geosearch.shutdown();
        await dropTestDatabase();
    });

    test("Radius around a point isn't containing any other polygons or points", async () => {
        const result = await geosearch.find(
            [13.409403562545775, 52.52084634012015],
            30
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });

    test('Radius around a point is containing three polygons and one point', async () => {
        const result = await geosearch.find(
            [13.409403562545775, 52.52084634012015],
            100
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2, feature3, point1],
        });
    });

    test('Radius around a point is containing two points', async () => {
        const result = await geosearch.find(
            [13.407976627349854, 52.51927627894419],
            90
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [point2, point3],
        });
    });

    test('Radius around a point is containing one polygon', async () => {
        const result = await geosearch.find(
            [13.410465717315674, 52.520128231784234],
            50
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });
    });
});
