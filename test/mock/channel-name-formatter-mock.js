angular.module('channelNameFormatterMock',[]);
angular.module('channelNameFormatterMock').factory("channelNameFormatter", function(){

  var service = {};

  service.shareWithResult = function(channel) {
    return '!' + channel.name;
  };

  service.shareWith = function(channel) {
    return service.shareWithResult(channel);
  };

  spyOn(service, 'shareWith').and.callThrough();

  return service;
});
