angular.module('webApp').factory('fwImageBlockFactory',
  function($compile) {
    'use strict';

    var service = {};

    service.createBlock = function(){

      return SirTrevor.Block.extend({

        type: 'image',
        title: function() { return i18n.t('blocks:image:title'); },
        icon_name: 'image',

        beforeBlockRender: function() {
          var self = this;
          this.$scope = this.options.custom.createScope();
          this.$scope.uploadStarted = function(){
            self.setData({ isBusy: true });
          };
          this.$scope.processingComplete = function(data){
            self.setData(data);
            self.setData({ isBusy: false });
          };
        },

        loadData: function(data){
          this.$scope.fileId = data.fileId;
          this.$scope.containerName = data.containerName;
          this.$scope.renderSize = data.renderSize;
        },

        onBlockRender: function(){
          this.$inner.addClass('st-block__inner--fw-image-block');

          var elementText = '<fw-image-block channel-id="{{channelId}}" file-id="{{fileId}}" container-name="{{containerName}}" render-size="renderSize" on-upload-started-delegate="uploadStarted()" on-processing-complete-delegate="processingComplete(data)"></fw-image-block>';
          this.imageBlockElement = $compile(elementText)( this.$scope );

          this.$editor.html(this.imageBlockElement);
        }
      });
    };

    return service;
  });
