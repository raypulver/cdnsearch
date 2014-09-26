#!/usr/bin/env node
var args = process.argv.slice(2),
    exit = process.exit,
    log = console.log;
beforeRequire();
var cdnsearch = require('./'),
    Promise = require('bluebird');
    detailed = false,
    minimal = false;
for (var i = 0; i < args.length; i++) {
  if (args[i] === '-d' || args[i] === '--detailed') {
    args.splice(i, 1);
    detailed = true;
    break;
  }
}
for (var i = 0; i < args.length; i++) {
  if (args[i] === '-m' || args[i] === '--minimal') {
    args.splice(i, 1);
    minimal = true;
    break;
  }
}
Promise.all(args.reduce(function (r, v) {
  r.push(new Promise(function (resolve) {
    cdnsearch(v, detailed, function (results) {
      resolve(results);
    });
  }));
  return r;
}, [])).then(function (results) {
  results.forEach(function (v, i, arr) {
    if (minimal) v.forEach(function (v) {
      log(v.cdn);
    });
    else if (detailed) {
      v.forEach(function (v, ii, arrr) {
        var afterDesc = (i === arr.length - 1 && ii === arrr.length - 1) ? '' : "\n";
        process.stdout.write(v.title + ' -> ');
        v.cdn.forEach(function (vv, i) {
          var sep = spaces(v.title.length + 4);
          if (i === 0) sep = '';
          console.log(sep + vv);
        });
        log(v.description + afterDesc);
      });
    }
    else {
      v.forEach(function (v, i) {
        console.log(v.title + ' -> ' + v.cdn);
      });
    }
  });
});

function beforeRequire () {
  for (i = 0; i < args.length; i++) {
    if (args[i] === '-v' || args[i] === '--version') {
      log(require('./package').version);
      exit(0);
    }
  }
  for (i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
      log('cdnsearch [OPTION] SEARCH1 [SEARCH2] ...');
      log('Search for the URL of a library hosted on cdnjs.cloudflare.com. Searches use % for wildcard. Multiple searches can be issued at once.');
      log('  -v, --version    display version number');
      log('  -m, --minimal    only display URL of matching libraries. useful when you know your SEARCH1 will match exactly one library');
      log('  -d, --detailed    fetch details for all matching libraries');
      exit(0);
    }
  }
}
function spaces(n) {
  var ret = '';
  for (var i = 0; i < n; i++) {
    ret += ' ';
  }
  return ret;
}
