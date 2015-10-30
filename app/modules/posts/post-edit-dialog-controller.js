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
    var model = $scope.model = {};

    var scheduleModes = postEditDialogConstants.scheduleModes;
    $scope.scheduleModes = scheduleModes;

    $scope.save = function(){
      return postEditDialogUtilities.performSave(postId, model)
        .then(function() {
          return postEditDialogUtilities.applyChangesToPost(internal.post, model, accountSettingsRepository, blogRepository, subscriptionRepository);
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

    internal.watchForBusyBlocks = function(){
      $scope.$watch('model.input.content', function(){
        model.isProcessing = model.input.content && !!model.input.content.busyBlockCount;
      });
    };

    this.initialize = function(){
      model.isLoading = true;
      return postEditDialogUtilities.getFullPost(postId, accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(post){
          model = $scope.model = internal.createModelFromPost(post);
          internal.post = post;

          $scope.$watch('model.input.date', function(newValue, oldValue){
            if(!areDatesEqual(newValue, oldValue)){
              model.input.scheduleMode = scheduleModes.scheduled;
            }
          });

          internal.watchForBusyBlocks();

          model.input.content = {
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

          return blogRepository.getQueuesSorted();
        })
        .then(function(queues){
          model.queues = queues;
          if(queues.length > 0){
            if(internal.post.queueId){
              model.input.selectedQueue = _.find(model.queues, {queueId: internal.post.queueId});
            }
            else{
              model.input.selectedQueue = queues[0];
            }

            $scope.$watch('model.input.selectedQueue', function(newValue, oldValue){
              if(newValue !== oldValue) {
                model.input.scheduleMode = scheduleModes.queued;
                return composeUtilities.updateEstimatedLiveDate(model);
              }
            });

            return composeUtilities.updateEstimatedLiveDate(model);
          }
        })
        .then(function(){
          model.showContent = true;
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    initializer.initialize(this.initialize);
  });
