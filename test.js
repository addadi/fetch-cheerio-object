'use strict';

const fetchCheerioObject = require('.');
const test = require('tape');

test('fetchCheerioObject()', t => {
  t.plan(7);

  t.equal(fetchCheerioObject.name, 'fetchCheerioObject', 'should have a function name.');

  fetchCheerioObject('https://example.org/').then($ => {
    t.equal(
      $('head')
      .find(':not([charset])')
      .remove()
      .end()
      .html()
      .trim(),
      '<meta charset="utf-8">',
      'should fetch a HTML and parse it as a cheerio object.'
    );
  }).catch(t.fail);

  fetchCheerioObject('https://example.org/', {xmlMode: true}).then($ => {
    t.equal(
      $('head')
      .find(':not([charset])')
      .remove()
      .end()
      .html()
      .trim(),
      '<meta charset="utf-8"/>',
      'should support htmlparser2 options.'
    );
  }).catch(t.fail);

  fetchCheerioObject('https://www.npmjs.com/favicon.ico').then($ => {
    t.equal($('*').html(), null, 'should even read a non-text files.');
  }).catch(t.fail);

  fetchCheerioObject('https://n/o/t/f.o.u.n.d').then(t.fail, ({message}) => {
    t.ok(/ENOTFOUND.*443/.test(message), 'should fail when it cannot get a contents from the URL.');
  }).catch(t.fail);

  fetchCheerioObject(['https://example.org/']).then(t.fail, ({message}) => {
    t.equal(
      message,
      'The "url" argument must be of type string. Received type object',
      'should fail when it takes a non-string argument as its first argument.'
    );
  }).catch(t.fail);

  fetchCheerioObject().then(t.fail, err => {
    t.ok(/TypeError.*undefined/.test(err), 'should fail when it takes a no arguments.');
  }).catch(t.fail);
});
