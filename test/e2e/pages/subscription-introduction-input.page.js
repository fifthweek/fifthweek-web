'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var BlogNameInputPage = function() {};

BlogNameInputPage.prototype = Object.create({},
{
  defaultValue: { value: function() {
    return 'Welcome to my new exclusive series. More of your favourites released every week, available to subscribers only.';
  }}
});

module.exports = BlogNameInputPage;
