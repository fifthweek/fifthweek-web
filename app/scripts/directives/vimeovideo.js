angular.module('webApp').directive('vimeoVideo', function() {
  'use strict';

  return {
    link: function(scope, elm, attrs) {
      var player = $f(elm[0]);

      player.addEvent('ready', function() {
        player.addEvent('play', function(){
          _kmq.push(['record', 'Played video "' + attrs.title + '"']); });
        player.addEvent('pause', function(){
          _kmq.push(['record', 'Paused video "' + attrs.title + '"']); });
        player.addEvent('finish', function(){
          _kmq.push(['record', 'Finished video "' + attrs.title + '"']); });
      });
    }
  };
});
