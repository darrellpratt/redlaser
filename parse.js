var fs = require("fs");
var csv = require("csv-streamify");
var JSONStream = require("JSONStream");
var lazy = require('lazy');
var JSON = require('JSON');

var csvToJson = csv({objectMode: true, quote: '\'', columns: true, delimiter: '|'});
var jsonToStrings = JSONStream.stringify();

var couchbase = require('couchbase');
var db = new couchbase.Connection({host: 'localhost:8091', bucket: 'redlaser'});

// var test = '{"pod_id":"4412134","lrtacode":"MEJTL","ltraname":"MEIJER TOTAL CENSUS TRADING AREA","sorgcd":"MEJ","spsuedocd":"165614","sname":"Meijer Supermarket","sstreetadd":"7157 E Saginaw St","scity":"East Lansing","sst":"MI","szip":"48823","sareacd":"517","sphoneno":"8859000","slat":42.7706,"slong":-84.4191,"sformatcd":"Grocery - Supercenter","mmgbmktnm":"Grand Rapids","sno":"00253"},{"pod_id":"4566680","lrtacode":"DORTL","ltraname":"DOLLAR GENERAL TOTAL CENSUS TA","sorgcd":"DOL","spsuedocd":"184180","sname":"Dollar General","sstreetadd":"3520 W Main St","scity":"Cabot","sst":"AR","szip":"72023","sareacd":"NOT APPLICABLE","sphoneno":"NOT APPLICABLE","slat":"34.9835","slong":"-92.0595","sformatcd":"Mass Merch - Dollar Store","mmgbmktnm":"Memphis","sno":"14550"}';
//test.replace(/\"([-+]?\d*[.]?\d+)\"/g,"$1")

// store ref
var storeRef = {
  "srcFile": "./data/mp_str_ref.txt.bak",
  "jsonFile": "./data/mp_str_ref.json",
  "typeKey": "store_ref",
  "idKey": "pod_id"
};

// sales fact
var salesFact = {
  "srcFile": "./data/mp_EXTRACT.txt.bak",
  "jsonFile": "./data/mp_EXTRACT.json",
  "typeKey": "sales_fact",
  "idKey": "pod_id"
};

// product ref
var productRef = {
  "srcFile": "./data/mp_prdc_ref.txt",
  "jsonFile": "./data/mp_prdc_ref.json",
  "typeKey": "product",
  "idKey": "prdc_key"
};

var ref = productRef;
// var op = 'parse';
//var op = 'replace';
var op = 'db';


// Read File
if (op === 'parse') {

  var parser = new Transform();
  parser._transform = function(data, encoding, done) {
    this.push(data);
    done();
  };

  fs.createReadStream(ref.srcFile)
      // Parse CSV as Object
      .pipe(csvToJson)
      // Parse JSON
      .pipe(jsonToStrings)
      .pipe(process.stdout)
    ;
} else if (op === 'db') {
  new lazy(
    fs.createReadStream(ref.jsonFile))
    .lines
    .forEach(function(line) {
      var obj = JSON.parse(line.toString());
      obj.type = ref.typeKey;
      if (ref.typeKey === 'store_ref') {
        // spatial
        var loc = [obj.slong, obj.slat];

        obj.loc = loc;
        // -- end spatial
      }
      if (ref.typeKey === 'sales_fact') {
        var key = obj.pod_id + "_" + obj.prdc_key + "_" + obj.prd_id;
      } else {
        var key = obj[ref.idKey];
      };
      // console.log(obj);


      db.set(key, obj, function(err, result) {
        console.log(result);
      });
      console.log(key);
    });
} else if (op === 'replace') {
  console.log("replacing");
}
