### Welcome to our coding challenge!

In this challenge, we’re asking you to create your own implementation of the given interface `GeofenceInterface` with the technology of your choice.

The interface is already specified and documented, the only thing you have to do is to write your implementation in the `Geofence` class.

The challenge is considered as completed if the unit test is passing.

Please do not commit in this repository but make a fork and send us the link once you're done.

If any infrastructure is needed, please add it to the `docker-compose.yml` file.

Happy coding!

### Usage

```typescript
const geofence = new Geofence();

await geofence.init({
    type: 'FeatureCollection',
    features: [
        // feature1
        // feature2
        // ...
    ],
});

await geofence.set(/** position inside feature1 */);
// will return a feature collection with feature1

await geofence.set(/** position outside feature1 and feature2 */);
// will return an empty feature collection
```

### Project usage

-   `yarn up|down` spin up local infrastructure
-   `yarn test` run unit tests
-   `yarn build` compile project
