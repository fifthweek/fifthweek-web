angular.module('webApp').factory('fwBreakBlockFactory',
  function() {
    'use strict';

    var service = {};

    service.createBlock = function(){

      return SirTrevor.Block.extend({

        type: 'break',

        title: function() { return 'Break'; },

        editorHTML: '<p class="post-break-line">⁂</p>',

        icon_name: 'iframe',

        loadData: function(){
        },

        onBlockRender: function() {
          this.$editor.html(this.editorHTML);
        }
      });
    };

    return service;
  });
