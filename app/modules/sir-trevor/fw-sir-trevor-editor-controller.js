angular.module('webApp')
  .controller('fwSirTrevorEditorCtrl', function ($scope, $element, $timeout, $interval, formConstants, markdownService, jsonService, fwImageBlockFactory, fwFileBlockFactory) {
    'use strict';

    var fileBlockExternalData = ['containerName', 'renderSize', 'fileSize', 'fileName'];

    var internal = this.internal = {
      editor: undefined,
      childScopes: []
    };

    internal.render = function(){
      $scope.sirTrevorValue = internal.fifthweekToSirTrevor(internal.ngModelCtrl.$viewValue);
    };

    internal.setViewValue = function(){
      var fifthweekValue = internal.sirTrevorToFifthweek($scope.sirTrevorValue);

      var shouldUpdate = false;
      if(internal.ngModelCtrl.$viewValue){
        // Only update if the data in the blocks has changed (otherwise additional metadata
        // added by Sir Trevor will make the form dirty on opening an existing post).
        shouldUpdate = !fifthweekValue || fifthweekValue.serializedBlocks !== internal.ngModelCtrl.$viewValue.serializedBlocks;
      }
      else{
        // If both fifthweekValue and the current $viewValue are falsy,
        // then do not update or we will make the form dirty when creating a new post.
        shouldUpdate = !!fifthweekValue;
      }

      if(shouldUpdate){
        internal.ngModelCtrl.$setViewValue(fifthweekValue);
      }

      internal.setValidity(fifthweekValue);
    };

    internal.setValidity = function(fifthweekValue){
      if($scope.maxlength && fifthweekValue){
        $scope.remaining = $scope.maxlength - fifthweekValue.serializedBlocks.length;
        internal.ngModelCtrl.$setValidity('maxlength', $scope.remaining >= 0);
      }

      if($scope.ngRequired){
        internal.ngModelCtrl.$setValidity('required', fifthweekValue && fifthweekValue.blockCount > 0);
      }
    };

    internal.isFileOrImageBlock = function(block){
      return internal.isFileBlock(block) || internal.isImageBlock(block);
    };

    internal.isFileBlock = function(block){
      return block.type === 'file';
    };

    internal.isImageBlock = function(block){
      return block.type === 'image';
    };

    internal.isTextBlock = function(block){
      return block.type === 'text';
    };

    internal.getWordCount = function(text){
      // http://stackoverflow.com/a/30335883/37725
      var result = text.replace(/[^\w\s]|_/g, '')
         .replace(/\s+/g, ' ')
         .match(/\S+/g) || [];

      return result.length;
    };

    internal.sirTrevorToFifthweek = function(sirTrevorValue){
      if(!sirTrevorValue){
        return sirTrevorValue;
      }

      var files = [];
      var busyBlockCount = 0;
      var blocks = _.cloneDeep(sirTrevorValue.data);

      _.forEach(blocks, function(block){
        if(internal.isTextBlock(block)){
          block.data = {
            format: 'md',
            text: markdownService.createMarkdown(block.data.text)
          };
        }
        else if(internal.isFileOrImageBlock(block)){
          if(block.data.isBusy){
            busyBlockCount++;
            block.data = {}; // We want busy blocks to be removed, so set it as unpopulated.
          }
          else if(block.data.fileId){
            delete block.data.isBusy;

            var fileBlock = {
              fileId: block.data.fileId
            };

            _.forEach(fileBlockExternalData, function(key){
              fileBlock[key] = block.data[key];
              delete block.data[key];
            });

            files.push(fileBlock);
          }
        }
      });

      var populatedBlocks = internal.getPopulatedBlocks(blocks);

      if(populatedBlocks.length === 0 && !busyBlockCount){
        return undefined;
      }

      var imageCount = 0;
      var fileCount = 0;
      var wordCount = 0;
      var previewWordCount = 0;
      var previewImageId = undefined;
      var previewText;
      _.forEach(populatedBlocks, function(block){
        if(internal.isTextBlock(block)){
          if(!previewText){
            previewText = block.data.text.substring(0, 1000);
            previewWordCount = internal.getWordCount(previewText);
          }

          wordCount += internal.getWordCount(block.data.text);
        }
        else if(internal.isFileBlock(block)) {
          fileCount++;
        }
        else if(internal.isImageBlock(block)) {
          imageCount++;
          if(!previewImageId){
            previewImageId = block.data.fileId;
          }
        }
      });

      if(!previewText){
        previewText = undefined;
      }

      var serializedBlocks = jsonService.toJson(populatedBlocks);

      var result = {
        serializedBlocks: serializedBlocks,
        files: files,
        blockCount: populatedBlocks.length,
        imageCount: imageCount,
        fileCount: fileCount,
        previewWordCount: previewWordCount,
        wordCount: wordCount,
        previewImageId: previewImageId,
        previewText: previewText
      };

      if(busyBlockCount){
        result.busyBlockCount = busyBlockCount;
      }

      return result;
    };

    internal.fifthweekToSirTrevor = function(fifthweekValue){
      if(!fifthweekValue){
        return fifthweekValue;
      }

      var blocks = jsonService.fromJson(fifthweekValue.serializedBlocks);
      var populatedBlocks = internal.getPopulatedBlocks(blocks);

      _.forEach(populatedBlocks, function(block){
        if(internal.isTextBlock(block)){
          block.data = {
            format: 'html',
            text: markdownService.renderMarkdown(block.data.text)
          };
        }
        else if(internal.isFileOrImageBlock(block)){
          var externalData = _.find(fifthweekValue.files, { fileId: block.data.fileId });
          _.forEach(fileBlockExternalData, function(key){
            block.data[key] = externalData[key];
          });
        }
      });

      return { data: blocks };
    };

    internal.getPopulatedBlocks = function(blocks){
      return _.filter(blocks, function(block){
        if(internal.isTextBlock(block)){
          return block.data && block.data.text && block.data.text.length > 0;
        }
        else if(internal.isFileOrImageBlock(block)) {
          return block.data && block.data.fileId;
        }
        return false;
      });
    };

    internal.load = function(){
      return $timeout(internal.onLoaded);

      /*
      $scope.isLoading = true;
      // TODO: Lazy load Sir Trevor here.
      return lazyLoadSirTravis(function(){
        $scope.isLoading = false;
        return $timeout(internal.onLoaded);
      });
      */
    };

    internal.onLoaded = function(){

      SirTrevor.config.skipValidation = true;
      SirTrevor.Blocks.Image = fwImageBlockFactory.createBlock();
      SirTrevor.Blocks.File = fwFileBlockFactory.createBlock();
      internal.editor = new SirTrevor.Editor({
        el: $('.js-st-instance'),
        blockTypes: [
          'Text',
          'Image',
          'File'
        ],
        defaultType: 'Text',
        ignoreFormEvents: true,
        blockLimit: $scope.textOnly ? 1 : 0,
        textFormatting: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          link: true,
          h1: !$scope.textOnly,
          h2: !$scope.textOnly,
          list: true,
          blockquote: true
        },
        custom: {
          createScope: function(){
            var newScope = $scope.$new();
            newScope.channelId = $scope.channelId;
            internal.childScopes.push(newScope);
            return newScope;
          }
        }
      });
      internal.attachToSirTrevor();
    };

    internal.attachToSirTrevor = function(){
      internal.timer = $interval(internal.performRead, 1000);
      //$(".st-blocks").on("keyup", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.on("block:reorder:dropped", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.on("block:create:new", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.on("block:remove", internal.onSirTrevorChanged);
    };

    internal.detatchFromSirTrevor = function(){
      if(internal.timer){
        $interval.cancel(internal.timer);
      }
      //$(".st-blocks").off("keyup", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.off("block:reorder:dropped", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.off("block:create:new", internal.onSirTrevorChanged);
      //SirTrevor.EventBus.off("block:remove", internal.onSirTrevorChanged);
    };

    internal.performRead = function(){
      //internal.onSirTrevorChanged.cancel();
      if(internal.editor){
        var errors = internal.editor.onFormSubmit(false);
        if(!errors){
          $scope.sirTrevorValue = internal.editor.store.retrieve();
          internal.setViewValue();
        }
      }
    };

    internal.dispose = function(){
      _.forEach(internal.childScopes, function(childScope){
        childScope.$destroy();
      });

      internal.detatchFromSirTrevor();
    };

    this.initialize = function(ngModelCtrl_){
      $element.on('$destroy', function () {
        internal.dispose();
      });

      //internal.onSirTrevorChanged = _.throttle(internal.performRead, 1000);

      internal.ngModelCtrl = ngModelCtrl_;
      internal.ngModelCtrl.$render = internal.render;

      // We're going to handle these ourselves.
      delete internal.ngModelCtrl.$validators.required;
      delete internal.ngModelCtrl.$validators.maxlength;

      $scope.$on(formConstants.formSubmittingEvent, internal.performRead);
      return internal.load();
    };
  });
