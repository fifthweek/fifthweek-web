angular.module('webApp').run(function($analytics) {
  'use strict';

  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  var emailAddress = getParameterByName('emailed_to');
  if (emailAddress.length > 0) {
    $analytics.setUserProperties({
      'last opened email from': emailAddress
    });
  }
});

