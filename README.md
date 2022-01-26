### Welcome to our geo-coding challenge!

In this challenge, we’re asking you to create your own implementation of the given interfaces with the technology of your choice.

The interfaces are already specified and documented, the only thing you have to do is to write your implementation into the given classes.

The challenge is considered as completed if the unit test are passing: `yarn test`.

Please do not commit in this repository but make a fork and send us the link once you're done.  
Also feel free to extend/improve the project as you wish to show us anything that is important to you.

If any infrastructure is needed, you can add it to the `docker-compose.yml` file.

Happy coding!

### Challenge 1

Implement the [`GeofenceInterface`](src/geofence-interface.ts) into [`Geofence`](src/geofence.ts).

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

### Challenge 2

Implement the [`GeosearchInterface`](src/geosearch-interface.ts) into [`Geosearch`](src/geosearch.ts).

```typescript
const geosearch = new Geosearch();

await geofence.init({
    type: 'FeatureCollection',
    features: [
        // feature1
        // feature2
        // point1
        // point2
        // ...
    ],
});

await geosearch.find(/** position+radius containing feature1 */);
// will return a feature collection with feature1

await geosearch.find(/** position+radius containing nothing */);
// will return an empty feature collection
```

### Project usage

-   `yarn up|down` spin up local infrastructure
-   `yarn test` run unit tests
-   `yarn build` compile project
