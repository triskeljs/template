/* global describe, it */

var assert = require('assert');
var template = require('../template');

const FS = require('fs');

var example_html = FS.readFileSync('tests/example.html', 'utf8');
var example_result_html = FS.readFileSync('tests/example-result.html', 'utf8');

var data = {
  lang: 'en-US',
  is_dev: true,
  profile: {
    first_name: 'John'
  },
  list: [
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    'Aliquam tincidunt mauris eu risus.',
    'Vestibulum auctor dapibus neque.',
    'Nunc dignissim risus id metus.',
    'Cras ornare tristique elit.',
    'Vivamus vestibulum ntulla nec ante.',
    'Praesent placerat risus quis eros.',
    'Fusce pellentesque suscipit nibh.',
    'Integer vitae libero ac risus egestas placerat.',
    'Vestibulum commodo felis quis tortor.',
    'Ut aliquam sollicitudin leo.',
    'Cras iaculis ultricies nulla.',
    'Donec quis dui at dolor tempor interdum.',
  ]
};

describe('README', function () {

  it('example', function () {

    assert.strictEqual( template(example_html, data), example_result_html );
    assert.strictEqual( template(example_html)(data), example_result_html );

  });

});
