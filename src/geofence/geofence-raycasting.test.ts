import { GeofenceRayCasting } from '.';
import { data } from './geofence.fixtures';

const GeofenceRayCastingFactory = (): GeofenceRayCasting => {
    const geofence = new GeofenceRayCasting();

    return geofence;
};

describe('GeofenceRayCasting Test', () => {
    const geofence = GeofenceRayCastingFactory();

    const {
        features: [feature1, feature2],
    } = data;

    beforeAll(() => geofence.init(data));
    afterAll(() => geofence.shutdown());

    test("Point isn't inside any polygon", () => {
        const result = geofence.set([13.414188623428345, 52.52177986340841]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });

    test('Point is inside two polygons', () => {
        const result = geofence.set([13.413276672363281, 52.52185167207047]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2],
        });
    });

    test('Point is inside one polygon', () => {
        const result = geofence.set([13.412590026855469, 52.521812503723915]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });
    });

    test("Point isn't inside any polygon", () => {
        const result = geofence.set([13.411876559257507, 52.52180597566276]);

        expect(result).toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });
});
