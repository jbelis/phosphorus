var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;

var id = +process.argv[2];
var tests = [];

if (id) {
  addTest(id);
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
        addTest(file.slice(0, -5), next);
      } else {
        setImmediate(next);
      }
    })();
  });
}

function addTest(id, cb) {
  fs.readFile('test/' + id + '.json', function(err, data) {
    if (err || !data) {
      console.log('Error: invalid test ' + id + '.');
      process.exit(1);
    }
    tests.push(data);
    cb();
  });
}

function done() {
  console.log('Found ' + tests.length + ' test' + (tests.length !== 1 ? 's' : '') + '...');

  process.env.PORT = 9007;
  process.env.HOST = '0.0.0.0';
  require('./server').on('request', function(req, res) {
    var u = url.parse(req.url);
    if (u.pathname === '/test-run') {
      fs.readFile(__dirname + '/test-run.html', function(err, data) {
        if (err || !data) {
          res.writeHead(404);
          return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        return res.end((data+'').replace(/\/\*tests\*\//, tests.join(',')));
      });
    }
    if (u.pathname === '/test-result') {
      var data = '';
      req.on('data', function(b) {
        data += b;
      });
      req.on('end', function() {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.log('Error: received invalid test data.');
        }
        console.log(data);
        res.end();
        // process.exit(0);
      });
    }
  });

  exec('./open-url http://localhost:9007/test-run');
}
