angular.module('webApp')
  .controller('objectLookupCtrl',
  function($scope, initializer, userStateStub, blogStub, errorFacade, impersonationService, authenticationService) {
    'use strict';


    var model = $scope.model = {
      errorMessage: undefined,
      lookupResult: undefined,
      userId: undefined,
      input: {
        value: undefined
      }
    };

    $scope.currentUser = authenticationService.currentUser;

    var internal = this.internal = {};

    internal.initialize = function(){
    };

    internal.performLookup = function(lookupDelegate, getUserIdDelegate){
      return lookupDelegate()
        .then(function(result){
          model.lookupResult = JSON.stringify(result, undefined, 2);
          if(getUserIdDelegate){
            model.userId = getUserIdDelegate(result);
          }
          else {
            model.userId = undefined;
          }
        })
        .catch(function(error){
          model.lookupResult = JSON.stringify(error, undefined, 2);
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    $scope.lookupUsername = function(){
      return internal.performLookup(function(){
        return blogStub.getLandingPage(model.input.value);
      }, function(result){
        return result.data.userId;
      });
    };

    $scope.lookupUserId = function(){
      return internal.performLookup(function(){
        return userStateStub.getUserState(model.input.value, true);
      }, function(){
        return model.input.value;
      });
    };

    $scope.stopImpersonating = function(){
      impersonationService.impersonate(undefined);
    };

    $scope.startImpersonating = function(){
      if(model.userId){
        impersonationService.impersonate(model.userId);
      }
    };

    initializer.initialize(internal.initialize);
  });
