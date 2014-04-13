var express = require('express');
var router = express.Router();
var geo = require('./geo');
var DISTANCE = 10;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/prod/:id/lat/:lat/lon/:lon/dist/:dist', function(req, res) {
  var upc = req.params.id;
  var lat = req.params.lat;
  var lon = req.params.lon;
  var dist = req.params.dist;
  console.log(upc + ':' + lat + ':' + lon + ':' +  dist);
  var result = geo.findByUPCLatLonDist(upc,lat,lon,dist);
  console.log(result);
  console.log('before return');
  res.send(result);
});

router.get('/api/v1/prod/:id/lat/:lat/lon/:lon', function(req, res) {
  var upc = req.params.id;
  var lat = req.params.lat;
  var lon = req.params.lon;
  console.log(upc + ':' + lat + ':' + lon);
  var result = geo.findByUPCLatLonDist(upc,lat,lon,DISTANCE);
  console.log(result);
  console.log('before return');
  res.send(result);
});

router.get('/api/v1/mock/:id', function(req, res) {
  res.json('hello world');
});

module.exports = router;
