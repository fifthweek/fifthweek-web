angular.module('webApp').controller('composePostCtrl',
  function($q, $state, $scope, postStub, initializer, composeUtilities, blogRepositoryFactory, errorFacade) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    var model = {
      postLater: false,
      postToQueue: true,
      queuedLiveDate: undefined,
      committedChannel: undefined,
      channels: [],
      queues: [],
      isProcessing: false,
      input: {
        content: undefined,
        selectedQueue: undefined,
        date: ''
      },
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {
      cancelWatch: undefined
    };

    $scope.commitChannel = function(channel){
      model.committedChannel = channel;
    };

    $scope.postLater = function() {
      model.postLater = true;
      composeUtilities.updateEstimatedLiveDate(model);
      var cancelWatch1 = $scope.$watch('model.input.date', function(newValue, oldValue){
        if(newValue !== oldValue){
          model.postToQueue = false;
        }
      });
      var cancelWatch2 = $scope.$watch('model.input.selectedQueue', function(newValue, oldValue){
        if(newValue !== oldValue){
          model.postToQueue = true;
          composeUtilities.updateEstimatedLiveDate(model);
        }
      });
      internal.cancelWatch = function(){
        cancelWatch1();
        cancelWatch2();
      };
    };

    $scope.cancelPostLater = function() {
      model.postLater = false;
      internal.cancelWatch();
      internal.cancelWatch = undefined;
    };

    internal.post = function(data){
      if(!data || !data.content){
        model.errorMessage = 'Please provide some content.';
        return $q.when();
      }

      return postStub.postPost(data)
        .then(function(){
          // Ensures post appears on current view (live posts / scheduled) if posted to current view.
          // Oddly this does not hide the modal, which is actually what we want!
          $state.reload();
          $scope.$close();
        });
    };

    internal.getPostData = function(){
      var sourceData = model.input.content;
      if(!sourceData){
        return undefined;
      }

      return {
        channelId: model.committedChannel.channelId,
        content: sourceData.serializedBlocks,
        fileIds: _.map(sourceData.files, 'fileId'),
        imageCount: sourceData.imageCount,
        fileCount: sourceData.fileCount,
        videoCount: sourceData.videoCount,
        previewWordCount: sourceData.previewWordCount,
        wordCount: sourceData.wordCount,
        previewText: sourceData.previewText,
        previewImageId: sourceData.previewImageId
      };
    };

    $scope.postNow = function() {
      var data = internal.getPostData();

      return internal.post(data);
    };

    $scope.postToBacklog = function() {
      var data = internal.getPostData();

      data.scheduledPostTime = model.postToQueue ? undefined : model.input.date;
      data.queueId = model.postToQueue ? model.input.selectedQueue.queueId : undefined;

      return internal.post(data);
    };

    internal.updateIsProcessing = function(){
      model.isProcessing = !!(model.input.content && !!model.input.content.busyBlockCount);
    };

    internal.watchForBusyBlocks = function(){
      $scope.$watch('model.input.content', internal.updateIsProcessing);
    };

    internal.initialize = function(){
      internal.watchForBusyBlocks();

      return blogRepository.getChannelsSorted()
        .then(function(channels){
          model.channels = channels;
          if(channels.length === 1){
            model.committedChannel = channels[0];
          }

          return blogRepository.getQueuesSorted();
        })
        .then(function(queues){
          model.queues = queues;
          if(queues.length > 0){
            model.input.selectedQueue = queues[0];
          }
          else{
            model.postToQueue = false;
          }
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        });
    };

    initializer.initialize(internal.initialize);
  });
