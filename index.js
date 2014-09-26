var request = require('request'),
    cheerio = require('cheerio'),
    Promise = require('bluebird'),
    TARGET = 'http://www.cdnjs.com';
module.exports = search;
search.buildRegExp = buildRegExp;
function search (str, verbose, cb) {
  var re = new RegExp(buildRegExp(str));
  request({
    method: 'GET',
    url: TARGET,
  }, function (err, resp, body) {
    var $ = cheerio.load(body);
    var libraries = [];
    var urls = $('tr.odd.gradeX.normal meta[itemprop="url"]'),
        versions = $('tr.odd.gradeX.normal meta[itemprop="version"]'),
        cdn = $('p[itemprop="downloadUrl"]');
    $('tr.odd.gradeX.normal a').each(function (i) {
      libraries.push({
        href: this.attribs.href,
        title: $(this).text().trim(),
        homepage: urls[i].attribs.content,
        version: versions[i].attribs.content,
        cdn: 'http:' + $(cdn[i]).text().trim()
      });
    });
    libraries = libraries.filter(function (v) {
      return re.test(v.title);
    });
    if (!verbose)
      cb(libraries);
    else
      fillDetails(libraries).then(function (values) {
        cb(values);
      });
  });
}
function fillDetails (libs) {
  return Promise.all(libs.reduce(function (r, v) {
    r.push(new Promise(function (resolve) {
      request(TARGET + '/' + v.href, function (err, resp, body) {
        var $ = cheerio.load(body);
        var urls = [];
        var version = $('select.form-control.version-selector option').eq(0).text().trim();
        $('div[data-library-version="' + version + '"] p.library-url').each(function () {
          urls.push('http:' + $(this).text().trim());
        });
        v.cdn = urls;
        v.description = $('div.row.library-container p.translateit').text().trim();
        resolve(v);
      });
    }));
    return r;
  }, []));
}
function buildRegExp (str) {
  return '^' + str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/%/g, '.*') + '$';
}
