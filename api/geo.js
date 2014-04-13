var GeoLocation = require('../lib/geolocation');
var JSON = require('JSON');

var geo = new GeoLocation(41.8748562,-87.6352741);



// console.log('obj');

console.log(JSON.stringify(geo));


var result = geo.boundingBox(10);

console.log(result);
