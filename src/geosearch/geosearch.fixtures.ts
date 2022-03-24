import { FeatureCollection, Point, Polygon } from '@vpriem/geojson';

export const data: FeatureCollection<Polygon | Point> = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [13.409720063209534, 52.52049055154815],
                        [13.410186767578123, 52.520369778625536],
                        [13.410111665725708, 52.52067987059652],
                        [13.409720063209534, 52.52049055154815],
                    ],
                ],
            },
        },
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [13.408936858177185, 52.52108788301316],
                        [13.40928018093109, 52.5212576150624],
                        [13.408872485160826, 52.52135227303578],
                        [13.408936858177185, 52.52108788301316],
                    ],
                ],
            },
        },
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [13.407767415046692, 52.52033713723809],
                        [13.4078049659729, 52.5201576091737],
                        [13.408207297325134, 52.52035019379598],
                        [13.408164381980896, 52.5205264569476],
                        [13.407767415046692, 52.52033713723809],
                    ],
                ],
            },
        },
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [13.408910036087034, 52.5205950035378],
            },
        },
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [13.40829849243164, 52.51995849537152],
            },
        },
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [13.406860828399658, 52.519622284771955],
            },
        },
    ],
};
