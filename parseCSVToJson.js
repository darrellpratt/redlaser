var fs = require("fs");
var csv = require("csv-streamify");
var JSONStream = require("JSONStream");
var lazy = require('lazy');
var JSON = require('JSON');

var csvToJson = csv({objectMode: true, columns: true});
var jsonToStrings = JSONStream.stringify(false);

var couchbase = require('couchbase');
var db = new couchbase.Connection({host: 'localhost:8091', bucket: 'redlaser'});

// Read File

fs.createReadStream("./mp_EXTRACT.txt")
    // Parse CSV as Object
    .pipe(csvToJson)
    // Parse JSON
    .pipe(jsonToStrings)
    .pipe(process.stdout)
  ;
