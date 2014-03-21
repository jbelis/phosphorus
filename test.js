var fs = require('fs');

require('./mock-dom.js');
var P = require('./phosphorus');
global.P_DEBUG = true;

var id = +process.argv[2];

var testCount = 0;
var failCount = 0;
var passCount = 0;

if (id) {
  runTest(id);
  done();
} else {
  fs.readdir('test', function(err, files) {
    if (err || !files) {
      console.log('Cannot read /test.');
      return;
    }
    var i = 0;
    (function next() {
      var file = files[i++];
      if (!file) {
        done();
      } else if (/^\d+\.json$/.test(file)) {
        runTest(file.slice(0, -5), next);
      } else {
        setImmediate(next);
      }
    })();
  });
}

function runTest(id, cb) {
  fs.readFile('test/' + id + '.json', function(err, data) {
    if (data) try {
      var json = P.IO.parseJSONish(data + '');
    } catch (e) {
      err = true;
    }
    if (err || !data) {
      console.log('Error: skipping test ' + id + '.');
      return;
    }
    testCount += 1;
    P.IO.loadJSONProject(json.project, function(stage) {
      var output = [];
      P.debug = function(obj, op, args) {
        output.push({
          obj: obj,
          op: op,
          args: args
        });
      };

      var stop = false;
      stage.handleError = function() {
        console.log('Fail: internal error');
        failCount += 1;
        stop = true;
        cb();
      };

      stage.triggerGreenFlag();

      for (var i = 0; !stop && (json.maxFrames ? i < json.maxFrames : stage.queue.length || stage.children.some(function(s) {return s.queue.length})); i++) {
        stage.step();
      }
      if (!stop) {
        passCount += 1;
      }
    });
  });
}

function done() {
  console.log('Ran ' + testCount + ' tests with ' + failCount + ' failures.');
}
