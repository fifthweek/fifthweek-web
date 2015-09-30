angular.module('webApp').directive('fwFormDirtyConfirmation',
  function ($state, $modal, uiRouterConstants, uiBootstrapConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        form: '=',
        formDirty: '=?',
        isModal: '@?'
      },
      link: function(scope) {

        scope.isModal = !!scope.isModal;

        if(!scope.form){
          return;
        }

        if(!scope.formDirty){
          scope.formDirty = function(){
            return scope.form.$dirty;
          };
        }

        scope.form.discard = function(){
          scope.form.discardChanges = true;
        };

        scope.form.discardChanges = false;
        scope.enabled = true;
        scope.displayed = false;

        var currentStateName = $state.current.name;

        var handleConfirmation = function(event, shouldDisplayCondition, continueMethod){
          var shouldDisplay = scope.enabled &&
            scope.formDirty() &&
            !scope.form.isSubmitting &&
            !scope.form.discardChanges &&
            shouldDisplayCondition();

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
                    continueMethod();
                  }
                })
                .finally(function(){
                  scope.displayed = false;
                });
            }
          }
        };

        if(scope.isModal){
          scope.$on(uiBootstrapConstants.modalClosingEvent, function(event) {

            var shouldDisplayCondition = function(){
              return true;
            };

            var continueMethod = function(){
              event.targetScope.$close();
            };

            handleConfirmation(event, shouldDisplayCondition, continueMethod);
          });
        }
        else{
          scope.$on(uiRouterConstants.stateChangeStartEvent, function(event, toState, toParams) {

            var shouldDisplayCondition = function(){
              return toState.name !== currentStateName;
            };

            var continueMethod = function(){
              $state.go(toState.name, toParams);
            };

            handleConfirmation(event, shouldDisplayCondition, continueMethod);
          });
        }
      }
    };
  });
