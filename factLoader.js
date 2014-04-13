var fs = require("fs");
var csv = require("csv-streamify");
var JSONStream = require("JSONStream");
var lazy = require('lazy');
var JSON = require('JSON');

var csvToJson = csv({objectMode: true, quote: '\'', columns: true, delimiter: '|'});
var jsonToStrings = JSONStream.stringify();

var couchbase = require('couchbase');
var db = new couchbase.Connection({host: 'localhost:8091', bucket: 'redlaser'});

//test.replace(/\"([-+]?\d*[.]?\d+)\"/g,"$1")

var inputFile = process.argv[2];

// store ref
var storeRef = {
  "srcFile": "./mp_str_ref.txt.bak",
  "jsonFile": "./mp_str_ref.json",
  "typeKey": "store_ref",
  "idKey": "pod_id"
};

// sales fact
var salesFact = {
  "srcFile": "./mp_EXTRACT.txt.bak",
  "jsonFile": "./tmp/xaaaaa",
  "typeKey": "sales_fact",
  // "idKey": "pod_id"
};

// product ref
var productRef = {
  "srcFile": "./mp_prdc_ref.txt",
  "jsonFile": "./mp_prdc_ref.json",
  "typeKey": "product",
  "idKey": "prdc_key"
};

var ref = salesFact;
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
  console.log(op);
  new lazy(
    fs.createReadStream(inputFile))
    .lines
    .forEach(function(line) {
      var obj = JSON.parse(line.toString());
      obj.type = ref.typeKey;

      if (ref.typeKey === 'sales_fact') {
        var key = obj.pod_id + "_" + obj.prdc_key + "_" + obj.prd_id;
        obj.price = obj.dol/obj.units;
        if (isNaN(obj.price)) {obj.price = 0;}
      } else {
        var key = obj[ref.idKey];
      };
      // console.log(obj);
      db.get(obj.pod_id, function(err, result) {
        if (err) {
          console.log(err);
        }  else {
          var loc = [result.value.slong, result.value.slat];
          obj.loc = loc;
          console.log(loc);
          db.set(key, obj, function(err, result) {
            console.log(result);
          });
          console.log(key);
          // console.log(obj);
        };
      });



    });
} else if (op === 'replace') {
  console.log("replacing");
}
