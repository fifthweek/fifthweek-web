angular.module('webApp').factory('deleteVerification', function($modal) {
    'use strict';

    var service = {};

    service.verifyDelete = function(action, dataEventTitle, dataEventCategory, itemType, item) {
      $modal.open({
        controller: 'deleteVerificationCtrl',
        templateUrl: 'views/partials/delete-verification.html',
        size: item ? undefined : 'sm',
        resolve: {
          deleteContext: function() {
            return {
              item: item,
              itemType: itemType,
              dataEventTitle: dataEventTitle,
              dataEventCategory: dataEventCategory,
              action: action
            };
          }
        }
      });
    };

    return service;
  }
);
