/* global describe, it */

var parseTemplate = require('../parser');
var assert = require('assert');

var specs = {
  'simple expresion': {
    src: 'foo ${ foobar } bar',
    deep_expect: [
      'foo ',
      { $$: ' foobar ' },
      ' bar'
    ]
  },
  'if expresion': {
    src: 'foo $if{ foobar } bar {/}',
    deep_expect: [
      'foo ',
      { $: 'if', $$: ' foobar ', _: ' bar ' }
    ]
  },
  'if else expresion': {
    src: 'foo $if{ foobar } foo {:} bar {/}',
    deep_expect: [
      'foo ',
      { $: 'if', $$: ' foobar ', _: ' foo ', __: ' bar ' }
    ]
  },
  'if expresion list content': {
    src: 'foo $if{ foobar } ${ foo } bar {/}',
    deep_expect: [
      'foo ',
      { $: 'if', $$: ' foobar ', _: [
        ' ',
        { $$: ' foo ' },
        ' bar ',
      ] }
    ],
  },
  'if else expresion list content': {
    src: 'foo $if{ foobar } ${ foo } {:} ${ bar } {/}',
    deep_expect: [
      'foo ',
      { $: 'if', $$: ' foobar ', _: [
        ' ',
        { $$: ' foo ' },
        ' ',
      ], __: [
        ' ',
        { $$: ' bar ' },
        ' ',
      ] }
    ]
  },
};

describe('parsing', function () {

  Object.keys(specs).forEach(function (spec_name) {
    var spec = specs[spec_name];

    it( spec_name, function () {

      var result = parseTemplate(spec.src);

      assert.deepEqual( result, spec.deep_expect, spec.src );
    });

  });

});
