angular.module('webApp')
  .controller('creatorRevenuesCtrl',
  function($scope, initializer, blogStub, errorFacade) {
    'use strict';

    var model = $scope.model = {
      errorMessage: undefined,
      isLoading: false,
      creators: []
    };

    var internal = this.internal = {};

    internal.initialize = function(){
      return internal.refresh();
    };

    internal.refresh = function(){
      model.isLoading = true;
      model.errorMessage = undefined;
      return blogStub.getCreatorRevenues()
        .then(function(result){
          model.creators = result.data.creators;
        })
        .catch(function(error){
          model.lookupResult = JSON.stringify(error, undefined, 2);
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    initializer.initialize(internal.initialize);
  });
