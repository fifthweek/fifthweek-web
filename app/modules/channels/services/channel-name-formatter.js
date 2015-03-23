angular.module('webApp').factory('channelNameFormatter', function() {
  'use strict';

  var service = {};

  service.shareWith = function(channel) {
    return channel.isDefault ? 'Share with everyone' : '"' + channel.name + '" Only';
  };

  return service;
});
