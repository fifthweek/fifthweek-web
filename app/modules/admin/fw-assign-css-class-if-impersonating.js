angular.module('webApp').directive('fwAssignCssClassIfImpersonating',
  function ($state, impersonationService, impersonationServiceConstants) {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element) {

        var cssClass = 'impersonating-user';

        var addClass = function(){
          element.addClass(cssClass);
        };

        var removeClass = function(){
          element.removeClass(cssClass);
        };

        if(impersonationService.impersonatedUserId) {
          addClass();
        }

        scope.$on(impersonationServiceConstants.impersonationChangedEvent, function(event, userId) {
          if(userId){
            addClass();
          }
          else{
            removeClass();
          }
        });
      }
    };
  });
