angular.module('webApp')
  .constant('postEditDialogConstants', {
    scheduleModes: {
      now: 0,
      scheduled: 1,
      queued: 2
    }
  })
  .controller('postEditDialogCtrl',
  function($scope, $q, post, postEditDialogConstants, composeUtilities, blobImageControlFactory, postEditDialogUtilities, errorFacade, initializer, blogRepositoryFactory) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    var areDatesEqual = function(a, b){
      // http://stackoverflow.com/a/15470800
      return a === b || a - b === 0;
    };

    // Clone this immediately so we can't accidentally modify it.
    post = _.cloneDeep(post);
    delete post.moment; // The moment can't be used after cloning, and we don't need it.

    var scheduleModes = postEditDialogConstants.scheduleModes;

    var scheduleMode = scheduleModes.now;
    if(post.isScheduled){
      if(post.queueId){
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
    $scope.scheduleModes = scheduleModes;
    $scope.blobImage = blobImageControlFactory.createControl();

    $scope.onImageUploadComplete = function(data) {
      var fileInformation = postEditDialogUtilities.getFileInformation(data);
      model.input.image = fileInformation.file;
      model.input.imageSource = fileInformation.fileSource;
      $scope.blobImage.update(data.containerName, data.fileId);
    };

    $scope.onFileUploadComplete = function(data) {
      var fileInformation = postEditDialogUtilities.getFileInformation(data);
      model.input.file = fileInformation.file;
      model.input.fileSource = fileInformation.fileSource;
    };

    $scope.save = function(){
      return postEditDialogUtilities.performSave(post.postId, model)
        .then(function() {
          return postEditDialogUtilities.applyChangesToPost(post, model);
        })
        .then(function(){
          $scope.$close(post);
        });
    };

    this.initialize = function(){

      $scope.$watch('model.input.date', function(newValue, oldValue){
        if(!areDatesEqual(newValue, oldValue)){
          model.input.scheduleMode = scheduleModes.scheduled;
        }
      });

      return blogRepository.getQueuesSorted()
        .then(function(queues){
          model.queues = queues;
          if(queues.length > 0){
            if(post.queueId){
              model.input.selectedQueue = _.find(model.queues, {queueId: post.queueId});
            }
            else{
              model.input.selectedQueue = queues[0];
            }

            $scope.$watch('model.input.selectedQueue', function(){
              return composeUtilities.updateEstimatedLiveDate(model);
            });
          }
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        });
    };

    initializer.initialize(this.initialize);
  });
