angular.module('webApp').factory('fwFileBlockFactory',
  function($compile) {
    'use strict';

    var service = {};

    service.createBlock = function(){

      return SirTrevor.Block.extend({

        type: "file",
        title: function() { return 'File'; },
        icon_name: 'link',

        beforeBlockRender: function() {
          var self = this;
          this.$scope = this.options.custom.createScope();
          this.$scope.uploadStarted = function(){
            self.setData({ isBusy: true });
          };
          this.$scope.uploadComplete = function(data){
            self.setData(data);
            self.setData({ isBusy: false });
          };
        },

        loadData: function(data){
          this.$scope.fileId = data.fileId;
          this.$scope.containerName = data.containerName;
          this.$scope.fileName = data.fileName;
        },

        onBlockRender: function(){
          this.$inner.addClass('st-block__inner--fw-file-block');

          var elementText = '<fw-file-block channel-id="{{channelId}}" file-id="{{fileId}}" container-name="{{containerName}}" file-name="{{fileName}}" on-upload-started-delegate="uploadStarted()"  on-upload-complete-delegate="uploadComplete(data)"></fw-file-block>';
          this.imageBlockElement = $compile(elementText)( this.$scope );

          this.$editor.html(this.imageBlockElement);
        }
      });
    };

    return service;
  });
