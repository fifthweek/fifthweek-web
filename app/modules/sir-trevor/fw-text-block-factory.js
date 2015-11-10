angular.module('webApp').factory('fwTextBlockFactory',
  function() {
    'use strict';

    var service = {};

    service.createBlock = function(){

      return SirTrevor.Block.extend({

        type: 'text',

        title: function() { return i18n.t('blocks:text:title'); },

        editorHTML: '<div class="st-required st-text-block" contenteditable="true"></div>',

        icon_name: 'text',

        loadData: function(data){
          this.setTextBlockHTML(data.text);
        },

        onBlockRender: function() {
          if(!this.options.custom.noFocus){
            this.focus();
          }
        }
      });
    };

    return service;
  });
