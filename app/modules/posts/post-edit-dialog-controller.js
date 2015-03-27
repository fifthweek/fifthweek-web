angular.module('webApp')
  .constant('postEditDialogConstants', {
    postTypes: {
      image: 'image',
      file: 'file',
      note: 'note'
    },
    scheduleModes: {
      now: 0,
      scheduled: 1,
      queued: 2
    }
  })
  .controller('postEditDialogCtrl',
  function($scope, $q, post, postEditDialogConstants, composeUtilities, blobImageControlFactory, postEditDialogUtilities) {
    'use strict';

    var areDatesEqual = function(a, b){
      // http://stackoverflow.com/a/15470800
      return a === b || a - b === 0;
    };

    // Clone this immediately so we can't accidentally modify it.
    post = _.cloneDeep(post);

    var postTypes = postEditDialogConstants.postTypes;
    var scheduleModes = postEditDialogConstants.scheduleModes;

    var scheduleMode = scheduleModes.now;
    if(post.isScheduled){
      if(post.scheduledByQueue){
        scheduleMode = scheduleModes.queued;
      }
      else{
        scheduleMode = scheduleModes.scheduled;
      }
    }

    var liveDate = new Date(post.liveDate);
    var roundedLiveDate = new Date(post.liveDate);
    roundedLiveDate.setUTCSeconds(0, 0);

    var model = {
      savedScheduleMode: scheduleMode,
      savedDate: liveDate,
      queuedLiveDate: undefined,
      input: {
        comment: post.comment,
        image: post.image,
        imageSource: post.imageSource,
        file: post.file,
        fileSource: post.fileSource,
        date: roundedLiveDate,
        scheduleMode: scheduleMode
      }
    };

    $scope.model = model;
    $scope.postTypes = postTypes;
    $scope.scheduleModes = scheduleModes;
    $scope.blobImage = blobImageControlFactory.createControl();

    if(post.image){
      model.postType = postTypes.image;
    }
    else if(post.file){
      model.postType = postTypes.file;
    }
    else{
      model.postType = postTypes.note;
    }

    $scope.onUploadComplete = function(data) {
      var fileInformation = postEditDialogUtilities.getFileInformation(data);
      if(model.postType === postTypes.file){
        model.input.file = fileInformation.file;
        model.input.fileSource = fileInformation.fileSource;
      }
      else if(model.postType === postTypes.image){
        model.input.image = fileInformation.file;
        model.input.imageSource = fileInformation.fileSource;
        $scope.blobImage.update(data.containerName, data.fileId);
      }
    };

    $scope.$watch('model.input.date', function(newValue, oldValue){
      if(!areDatesEqual(newValue, oldValue)){
        model.input.scheduleMode = scheduleModes.scheduled;
      }
    });

    composeUtilities.loadChannelsAndCollectionsIntoModel(model)
      .then(function(){

        model.input.selectedChannel = _.find(model.channels, {channelId: post.channel.channelId});
        if(model.postType !== postTypes.note){
          model.input.selectedCollection = _.find(model.collections, {collectionId: post.collection.collectionId});

          $scope.$watch('model.input.selectedCollection', function(){
            return composeUtilities.updateEstimatedLiveDate(model);
          });
        }
      });

    $scope.save = function(){
      return postEditDialogUtilities.performSave(post.postId, model)
        .then(function() {
          return postEditDialogUtilities.applyChangesToPost(post, model);
        })
        .then(function(){
          $scope.$close(post);
        });
    };
  }
);
