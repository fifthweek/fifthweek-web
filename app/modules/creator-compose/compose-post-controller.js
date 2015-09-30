angular.module('webApp').controller('composePostCtrl',
  function($q, $state, $scope, postStub, blobImageControlFactory, initializer, composeUtilities, blogRepositoryFactory, errorFacade) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    var model = {
      fileUploaded: false,
      imageUploaded: false,
      postLater: false,
      postToQueue: true,
      queuedLiveDate: undefined,
      committedChannel: undefined,
      channels: [],
      queues: [],
      processingImage: false,
      input: {
        fileId: undefined,
        imageId: undefined,
        comment: '',
        selectedQueue: undefined,
        date: ''
      },
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {
      cancelWatch: undefined
    };

    $scope.blobImage = blobImageControlFactory.createControl();

    internal.onBlobImageUpdateComplete = function(data){
      model.processingImage = false;
    };

    $scope.onImageUploadComplete = function(data) {
      model.imageUploaded = true;
      model.input.imageId = data.fileId;
      model.processingImage = true;
      $scope.blobImage.update(data.containerName, data.fileId, false, internal.onBlobImageUpdateComplete);
    };

    $scope.onFileUploadComplete = function(data) {
      model.fileUploaded = true;
      model.input.fileId = data.fileId;
      $scope.fileName = data.file.name;
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
      return postStub.postPost(data)
        .then(function(){
          // Ensures post appears on current view (live posts / scheduled) if posted to current view.
          // Oddly this does not hide the modal, which is actually what we want!
          $state.reload();
          $scope.$close();
        });
    };

    $scope.postNow = function() {
      var data = {
        channelId: model.committedChannel.channelId,
        fileId: model.input.fileId,
        imageId: model.input.imageId,
        comment: model.input.comment
      };

      return internal.post(data);
    };

    $scope.postToBacklog = function() {
      var data = {
        channelId: model.committedChannel.channelId,
        fileId: model.input.fileId,
        imageId: model.input.imageId,
        comment: model.input.comment,
        scheduledPostTime: model.postToQueue ? undefined : model.input.date,
        queueId: model.postToQueue ? model.input.selectedQueue.queueId : undefined
      };

      return internal.post(data);
    };

    internal.initialize = function(){
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
