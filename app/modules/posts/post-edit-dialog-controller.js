angular.module('webApp')
  .constant('postEditDialogConstants', {
    scheduleModes: {
      now: 0,
      scheduled: 1,
      queued: 2
    }
  })
  .controller('postEditDialogCtrl',
  function($scope, $q, postId, postEditDialogConstants, composeUtilities, blobImageControlFactory, postEditDialogUtilities, errorFacade, initializer, blogRepositoryFactory, accountSettingsRepositoryFactory, subscriptionRepositoryFactory) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var areDatesEqual = function(a, b){
      // http://stackoverflow.com/a/15470800
      return a === b || a - b === 0;
    };

    var internal = this.internal = {};
    $scope.model = {};

    var scheduleModes = postEditDialogConstants.scheduleModes;
    $scope.scheduleModes = scheduleModes;

    $scope.save = function(){
      return postEditDialogUtilities.performSave(postId, $scope.model)
        .then(function() {
          return postEditDialogUtilities.applyChangesToPost(internal.post, $scope.model, accountSettingsRepository, blogRepository, subscriptionRepository);
        })
        .then(function(){
          $scope.$close(internal.post);
        });
    };

    internal.createModelFromPost = function(post){
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

      return {
        savedScheduleMode: scheduleMode,
        savedDate: liveDate,
        queuedLiveDate: undefined,
        channelId: post.channelId,
        isProcessing: false,
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
    };

    internal.updateIsProcessing = function(){
      $scope.model.isProcessing = !!($scope.model.input.content && !!$scope.model.input.content.busyBlockCount);
    };

    internal.watchForBusyBlocks = function(){
      $scope.$watch('model.input.content', internal.updateIsProcessing);
    };

    internal.onInputDateChanged = function(newValue, oldValue){
      if(!areDatesEqual(newValue, oldValue)){
        $scope.model.input.scheduleMode = scheduleModes.scheduled;
      }
    };

    internal.onSelectedQueueChanged = function(newValue, oldValue){
      if(newValue !== oldValue) {
        $scope.model.input.scheduleMode = scheduleModes.queued;
        return composeUtilities.updateEstimatedLiveDate($scope.model);
      }
    };

    internal.updateContentFromPost = function(post){
      $scope.model.input.content = {
        serializedBlocks: post.content,
        files: _.map(post.files, function(file){
          return {
            fileId: file.information.fileId,
            containerName: file.information.containerName,
            renderSize: file.source.renderSize,
            fileName: file.source.fileName + '.' + file.source.fileExtension,
            fileSize: file.source.size
          };
        })
      };
    };

    this.initialize = function(){
      $scope.model.isLoading = true;
      return postEditDialogUtilities.getFullPost(postId, accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(post){
          $scope.model = internal.createModelFromPost(post);
          internal.post = post;

          $scope.$watch('model.input.date', internal.onInputDateChanged);

          internal.watchForBusyBlocks();

          internal.updateContentFromPost(post);

          return blogRepository.getQueuesSorted();
        })
        .then(function(queues){
          $scope.model.queues = queues;
          if(queues.length > 0){
            if(internal.post.queueId){
              $scope.model.input.selectedQueue = _.find($scope.model.queues, {queueId: internal.post.queueId});
            }
            else{
              $scope.model.input.selectedQueue = queues[0];
            }

            $scope.$watch('model.input.selectedQueue', internal.onSelectedQueueChanged);

            return composeUtilities.updateEstimatedLiveDate($scope.model);
          }
        })
        .then(function(){
          $scope.model.showContent = true;
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        })
        .finally(function(){
          $scope.model.isLoading = false;
        });
    };

    initializer.initialize(this.initialize);
  });
