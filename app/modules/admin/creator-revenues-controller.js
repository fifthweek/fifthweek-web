angular.module('webApp')
  .controller('creatorRevenuesCtrl',
  function($scope, initializer, blogStub, errorFacade) {
    'use strict';

    var fifthweekUserId = 'AAAAAAAAAAAAAAAAAAAAAA2';

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

          //var dummyResult = JSON.parse('{"creators":[{"userId":"AAAAAAAAAAAAAAAAAAAAAA2","unreleasedRevenue":21,"releasedRevenue":0,"releasableRevenue":21,"username":null,"name":null,"email":null,"emailConfirmed":false},{"userId":"-84gL0JjEeWT_gAVXcJ6PQ2","unreleasedRevenue":50,"releasedRevenue":0,"releasableRevenue":50,"username":"james2","name":"James Thurley","email":"james+james2@fifthweek.com","emailConfirmed":false}]}');
          //var creators = dummyResult.creators;

          var creators = result.data.creators;

          _.forEach(creators, function(creator){
            if(creator.userId === fifthweekUserId){
              creator.username = 'Fifthweek';
              creator.emailConfirmed = true;
            }
          });

          model.creators = creators;
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
