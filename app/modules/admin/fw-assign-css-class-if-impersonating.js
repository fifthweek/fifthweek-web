angular.module('webApp').directive('fwAssignCssClassIfImpersonating',
  function ($state, authenticationService, authenticationServiceConstants) {
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

        if(authenticationService.currentUser.nonImpersonatedUserId) {
          addClass();
        }

        scope.$on(authenticationServiceConstants.currentUserChangedEvent, function(event, currentUser) {
          if(currentUser.nonImpersonatedUserId){
            addClass();
          }
          else{
            removeClass();
          }
        });
      }
    };
  });
