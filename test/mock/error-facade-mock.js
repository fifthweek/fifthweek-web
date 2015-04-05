angular.module('errorFacadeMock',[]);
angular.module('errorFacadeMock').factory("errorFacade", function($q){

  var service = {};

  service.expectedMessage = function(error) {
    return '!' + error;
  };

  service.handleError = function(error, setMessage) {
    setMessage(service.expectedMessage(error));
    return $q.when();
  };

  spyOn(service, 'handleError').and.callThrough();

  return service;
});
