angular.module('webApp').directive('vimeoVideo', function(analytics) {
  'use strict';

  return {
    link: function(scope, elm, attrs) {
      var player = $f(elm[0]);

      elm.load(function() {
        player.addEvent('ready', function() {
          player.addEvent('play', function(){
            analytics.eventTrack('Played video "' + attrs.title + '"', 'Video');
          });
          player.addEvent('pause', function(){
            analytics.eventTrack('Paused video "' + attrs.title + '"', 'Video');
          });
          player.addEvent('finish', function(){
            analytics.eventTrack('Finished video "' + attrs.title + '"', 'Video');
          });
        });
      });
    }
  };
});
