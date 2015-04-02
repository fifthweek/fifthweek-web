angular.module('webApp').directive('fwFormDirtyConfirmation',
  function ($state, $modal, uiRouterConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        form: '='
      },
      link: function(scope) {

        if(!scope.form){
          return;
        }

        scope.form.discard = function(){
          scope.form.discardChanges = true;
        };

        scope.form.discardChanges = false;
        scope.enabled = true;
        scope.displayed = false;

        var currentStateName = $state.current.name;

        scope.$on(uiRouterConstants.stateChangeStartEvent, function(event, toState, toParams) {

          var shouldDisplay = scope.enabled &&
            scope.form.$dirty &&
            !scope.form.isSubmitting &&
            !scope.form.discardChanges &&
            toState.name !== currentStateName;

          if(shouldDisplay){
            event.preventDefault();

            if(!scope.displayed){
              scope.displayed = true;

              var dialogInstance = $modal.open({
                templateUrl: 'modules/common/fw-form-dirty-confirmation.html',
                size: 'sm'
              });

              dialogInstance.result
                .then(function(result){
                  if(result){
                    scope.enabled = false;
                    $state.go(toState.name, toParams);
                  }
                })
                .finally(function(){
                  scope.displayed = false;
                });
            }
          }
        });
      }
    };
  });
