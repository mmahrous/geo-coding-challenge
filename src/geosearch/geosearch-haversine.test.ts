import { GeosearchHaversine } from '.';
import { data } from './geosearch.fixtures';

describe('geosearch', () => {
    const geosearch = new GeosearchHaversine();

    const {
        features: [feature1, feature2, feature3, point1, point2, point3],
    } = data;

    beforeAll(() => geosearch.init(data));

    afterAll(() => geosearch.shutdown());

    test("Radius around a point isn't containing any other polygons or points", () => {
        const result = geosearch.find(
            [13.409403562545775, 52.52084634012015],
            30
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });

    test('Radius around a point is containing three polygons and one point', () => {
        const result = geosearch.find(
            [13.409403562545775, 52.52084634012015],
            100
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2, feature3, point1],
        });
    });

    test('Radius around a point is containing two points', () => {
        const result = geosearch.find(
            [13.407976627349854, 52.51927627894419],
            90
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [point2, point3],
        });
    });

    test('Radius around a point is containing one polygon', () => {
        const result = geosearch.find(
            [13.410465717315674, 52.520128231784234],
            50
        );

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });
    });
});
