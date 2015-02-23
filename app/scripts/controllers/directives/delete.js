angular.module('webApp').controller('deleteCtrl', function ($q, $scope, $modal, analytics, errorFacade) {
  'use strict';

  $scope.confirmationText = {
    value: ''
  };

  $scope.itemTypeLowered = $scope.itemType.toLowerCase();

  $scope.questionDelete = function() {
    $scope.modal = $modal.open({
      scope: $scope,
      templateUrl: 'views/partials/delete-confirm.html',
      size: $scope.item ? undefined : 'sm'
    });
  };

  // Todo: test the below!
  $scope.confirmDelete = function() {
    return $q.when($scope.delete()).then(function() {
        var eventTitle = $scope.dataEventTitle;
        var eventCategory = $scope.dataEventCategory;
        if(eventTitle && eventCategory){
          analytics.eventTrack(eventTitle,  eventCategory);
        }
      },
      function(error){
        return errorFacade.handleError(error, function(message) {
          form.message = message;
        });
      })
      .finally(function() {
        $scope.modal.close();
      }
    );
  };
});
