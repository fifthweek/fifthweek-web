angular.module('webApp').directive('vimeoVideo', function($analytics) {
  'use strict';

  return {
    link: function(scope, elm, attrs) {
      var player = $f(elm[0]);

      player.addEvent('ready', function() {
        player.addEvent('play', function(){
          $analytics.eventTrack('Played video: ' + attrs.title);
        });
        player.addEvent('pause', function(){
          $analytics.eventTrack('Paused video: ' + attrs.title);
        });
        player.addEvent('finish', function(){
          $analytics.eventTrack('Finished video: ' + attrs.title);
        });
      });
    }
  };
});
