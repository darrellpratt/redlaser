var GeoLocation = require('../lib/geolocation');
var JSON = require('JSON');
var request = require('request');
var couchbase = require('../../node_modules/couchbase');

var couchbaseHost = 'localhost:8091';
var couchbaseRestHost = 'http://localhost:8092';
var couchbaseViewHttp = '/redlaser/_design/store-ref/_spatial/storeGeoView?bbox=';

var db = new couchbase.Connection({host: couchbaseHost, bucket: 'redlaser'});

var queryView = function(bbox) {
  var q = {
    bbox: bbox
  };
  var view = db.view('store-ref', 'storeGeoView', q);
  view.query(function (err, values) {
    console.log(values);
    return values;
  })
};

var queryREST = function(bbox) {
  request(couchbaseRestHost + couchbaseViewHttp + bbox, function(error, response, body) {
  // request('http://127.0.0.1:8092/redlaser/_design/store-ref/_spatial/storeGeoView?bbox=-87.75605237002348,41.78492418056654,-87.5144958299765,41.96478821943347', function(error, response, body) {
    // console.log(body);
    // console.log(response);
    return body;
  });
};


exports.findByUPCLatLon = function(upc,lat,lon) {
    return this.findByUPCLatLonDist(upc,lat,lon,10);
};

exports.findByUPCLatLonDist = function(upc,lat,lon,dist,cb) {
  var geo = new GeoLocation(41.8748562,-87.6352741);
  var upcMock = 73410591;
  console.log(JSON.stringify(geo));
  var bbox = geo.boundingBox(dist);
  // use this on the view to couchbase
  console.log(bbox);
  request(couchbaseRestHost + couchbaseViewHttp + bbox, function(error, response, body) {
  // request('http://127.0.0.1:8092/redlaser/_design/store-ref/_spatial/storeGeoView?bbox=-87.75605237002348,41.78492418056654,-87.5144958299765,41.96478821943347', function(error, response, body) {
    // console.log(body);
    // console.log(response);
    // console.log(body);
    console.log('in request');
    cb(body);
  });

};
