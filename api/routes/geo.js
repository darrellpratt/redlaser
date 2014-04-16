// var GeoLocation = require('../lib/geolocation');
var GeoLocation = require('bbox-calc');
var JSON = require('JSON');
var request = require('request');
var couchbase = require('../../node_modules/couchbase');
var _ = require('underscore');

var couchbaseHost = 'localhost:8091';
var couchbaseRestHost = 'http://localhost:8092';
var couchbaseViewHttp = '/redlaser/_design/store-ref/_spatial/storeGeoView?bbox=';

var db = new couchbase.Connection({host: couchbaseHost, bucket: 'redlaser'});

// var n1qlQuery = function (raw, values, cb) {
//   console.log('into query n1ql');
//   values = [].concat(values);
//   db.query(raw, values, function(err, results) {
//     console.log('on results of n1ql');
//     if (err) {
//       console.log(err);
//     }
//     // results
//     console.log(results);
//     cb(results);
//   })
// }

var queryView = function(bbox, cb) {
  var q = {
    bbox: bbox
  };
  var view = db.view('store-ref', 'storeGeoView', q);
  view.query(function (err, values) {
    console.log(values);
    return values;
  })
}

var queryREST = function(bbox) {
  request(couchbaseRestHost + couchbaseViewHttp + bbox, function(error, response, body) {
  // request('http://127.0.0.1:8092/redlaser/_design/store-ref/_spatial/storeGeoView?bbox=-87.75605237002348,41.78492418056654,-87.5144958299765,41.96478821943347', function(error, response, body) {
    // console.log(body);
    // console.log(response);
    return body;
  })
}


exports.findByUPCLatLon = function(upc,lat,lon) {
    return this.findByUPCLatLonDist(upc,lat,lon,10);
}

exports.findByUPCLatLonDist = function(upc,lat,lon,dist,cb) {

  var geo = new GeoLocation(41.8748562,-87.6352741);
  var upcMock = 73410591;
  console.log(JSON.stringify(geo));
  var bbox = geo.boundingBox(dist);
  // use this on the view to couchbase
  console.log(bbox);
  request(couchbaseRestHost + couchbaseViewHttp + bbox, function(error, response, body) {
    // have stores, now need to call view for upc and store
    var result = JSON.parse(body);
    _.each(result.rows, function(i) {
      // console.log(i.id);
    })

    var queryParams = {
      stale: 'ok',
      //keys: [71774477,80253],
      limit: 20
    };

    console.log('before view query');
    console.log(queryParams);

    db.view('sales', 'salesByProductAndStore', queryParams).query(function(err, results) {
      console.log('into view query');
      console.log(err);
      console.log(results);
      console.log('leaving geo');
      cb(results);
    });

  })

}
