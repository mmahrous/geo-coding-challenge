import { Geofence } from '.';
import { data } from './geofence.fixtures';

describe('geofence', () => {
    const geofence = new Geofence();

    beforeAll(async () => geofence.init(data));

    afterAll(async () => geofence.shutdown());

    it('should pass', async () => {
        const {
            features: [feature1, feature2],
        } = data;

        await expect(
            geofence.set([13.414188623428345, 52.52177986340841])
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [],
        });

        await expect(
            geofence.set([13.413276672363281, 52.52185167207047])
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2],
        });

        await expect(
            geofence.set([13.412590026855469, 52.521812503723915])
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });

        await expect(
            geofence.set([13.411876559257507, 52.52180597566276])
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [],
        });
    });
});
