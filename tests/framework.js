/*jslint node: true */
'use strict';

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;


var framework = require('../src/client/js/framework.js');


var assert = require("assert");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
