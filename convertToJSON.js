var Stream = require('stream')
  , csv = require('csv-streamify')
  , JSONStream = require('JSONStream')
  , util = require('util');


var csvToJson = csv({objectMode: true, columns: true});

var parser = new Stream.Transform({objectMode: true});

parser._transform = function(data, encoding, done) {
  console.log(data);
  this.push(data);
  done();
};

var jsonToStrings = JSONStream.stringify(false);



process.stdin
.pipe(csvToJson)
// .pipe(parser)
.pipe(jsonToStrings)
// .pipe(couchIt)
// .pipe(process.stdout);
