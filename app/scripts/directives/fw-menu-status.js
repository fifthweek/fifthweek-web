// NOTE: This is defined in the Angular-Snap module.
angular.module('snap').directive('fwMenuStatus',
  function (snapRemote) {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element) {
        var openClassName = 'fw-menu-open';
        var closedClassName = 'fw-menu-closed';


        snapRemote.getSnapper().then(function(snapper){

          if(snapper.state().state === 'closed'){
            element.addClass(closedClassName);
          }
          else {
            element.addClass(openClassName);
          }

          snapper.on('open', function(){
            element.removeClass(closedClassName);
            element.addClass(openClassName);
          });
          snapper.on('close', function(){
            element.removeClass(openClassName);
            element.addClass(closedClassName);
          });
        });
      }
    };
  });
