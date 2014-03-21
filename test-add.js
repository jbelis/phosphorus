var fs = require('fs');
var http = require('http');
var url = require('url');
var exec = require('child_process').exec;

var id = Number(process.argv[2]);
var max = Number(process.argv[3]) || 0;
if (!id) {
  console.error('Usage: node test-add <id> [max-frames]');
  process.exit(1);
}

console.log('Fetching project...');
http.get('http://scratch.mit.edu/internalapi/project/' + id + '/get/', function(res) {
  if (res.statusCode !== 200) {
    console.log('Project does not exist.');
    res.resume();
    return;
  }
  projectData = '';
  res.on('data', function(chunk) {
    projectData += chunk;
  });
  res.on('end', function() {
    try {
      projectData = JSON.parse(projectData);
    } catch (e) {
      console.log('Error: invalid project data.');
      return;
    }
    http.createServer(function(req, res) {
      var u = url.parse(req.url);
      if (u.pathname === '/' || u.pathname === '/test-capture.swf') {
        fs.readFile(__dirname + '/' + (u.pathname.slice(1) || 'test-capture.html'), function(err, data) {
          if (err || !data) {
            res.writeHead(500);
            return res.end();
          }
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          return res.end(data);
        });
      } else if (u.pathname === '/test-add') {
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
          data.project = projectData;
          fs.writeFile('test/' + id + '.json', JSON.stringify(data), function(err) {
            if (err) throw err;
            res.end();
            process.exit(0);
          });
        });
      }
    }).listen(9007, '0.0.0.0');

    console.log('Running test...');
    exec('./open-url http://localhost:9007/?id=' + id + '&max=' + max);
  });
});
