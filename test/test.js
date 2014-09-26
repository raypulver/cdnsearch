var chai = require('chai');
var expect = chai.expect;
var cdnsearch = require('../');
describe('cdnjs fetching module', function () {
  it('converts a search string to a regex', function () {
    expect(String(cdnsearch.buildRegExp('search%'))).to.equal('^search.*$');
  });
  it('retrieves a simple list of libraries', function () {
    cdnsearch('', false, function (list) {
      expect(list.length).to.be.above(0);
      expect(Object.keys(list[Math.floor(Math.random()*list.length)]).length).to.be(5);
    });
  });
  it('can find jQuery', function () {
    cdnsearch('jquery', false, function (list) {
      expect(list[0].title).to.be('jquery');
    });
  });
  it('can retrieve detailed CDN links for jQuery', function () {
    cdnsearch('jquery', true, function (list) {
      expect(list[0].title).to.be('jquery');
      expect(list[0].cdn).to.have.length.above(1);
    });
  });
  it('can retrieve detailed CDN links for all libraries starting with "jquery"', function () {
    cdnsearch('jquery%', true, function (list) {
      list.forEach(function (v) {
        expect(v.title).to.match(/^jquery.*/);
        expect(v.cdn).to.have.length.above(1);
      });
    });
  });
});
