# notes-at-ng Sample App

> A note taking app that retrieves and stores location data for each note. This is a fork of a Vue.js MEVN application 
[github.com/brocktopia/notes-at](https://github.com/brocktopia/notes-at) implemented as a MEAN application using Angular 6.

## Dependencies

**Server-side**
* [Node.js](https://nodejs.org)
* [Express](https://github.com/expressjs/express)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://github.com/Automattic/mongoose)

**Client-side**
* [Angular 6](https://angular.io/)
* [@ngxs/store](https://github.com/ngxs/store)
* [angular-google-maps](https://angular-maps.com/)
* [ngx-moment](https://github.com/urish/ngx-moment)
* [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (for Maps JavaScript API &amp; Places API for Web)

## Configuration

You will need to set your Google API Key in [./src/app/google-maps.config.ts](src/app/google-maps.config.ts).
```js
const GoogleMapsConfig = {
  key: 'your-google-api-key',
  libraries: ['places']
};
```
You may also need to configure [./server.js](server.js) if your instance of MongoDB is running on a port
other than the default port `27017` or your local server is something other than `http://localhost`.
```js
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/' + dbName, {'useNewUrlParser': true});//
```

## Build Setup

``` bash
# install dependencies
npm install

# start express RESTful service layer at localhost:3030
npm run start-services

# if you have a locall ssl dev environment
# start express ssl RESTful service layer at localhost:3031
# /api/server-ssl.js requires configuration
npm run start-services-ssl

# build project
ng build

# serve with hot reload at localhost:8080
ng serve
```

## Resources

* [RESTfulAPITutorial](https://github.com/generalgmt/RESTfulAPITutorial) Provided the underpinnings of my API services
* [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) Documentation on navigator.geolocation from Mozilla.
* [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference/map)
* [Google Places Service API Reference](https://developers.google.com/maps/documentation/javascript/reference/places-service)

## Notes on Angular

Initially, there were enough similarities between Vue.js and Angular that starting the project was pretty strait forward. 
State management provided by @ngxs/store was significantly different from Vuex though, so that fundamentally changed some 
of my architecture. There were also some significant differences in routing behaviors that I had to work around. The AGM 
mapping package was also significantly different and I had to do more direct interfacing with the Google Maps API. I ended 
up changing a few of the applications behaviors, some based on fitting Angular's peculiarities and some were just genearal
improvements I'd been considering for the application. All in all I feel like it gave me a solid introduction to the 
Angular toolchain.

## To-Do Roadmap

* Implement testing

## Author
Brock Henderson [@brocktopia](https://github.com/brocktopia/) ||
[brocktopia.com](https://brocktopia.com)
