angular.module('webApp').factory('postEditDialogUtilities',
  function($q, postEditDialogConstants, postStub, postUtilities) {
    'use strict';

    var scheduleModes = postEditDialogConstants.scheduleModes;

    var service = {};
    service.internal = {};

    var areDatesEqual = function(a, b){
      // http://stackoverflow.com/a/15470800
      return a === b || a - b === 0;
    };

    var getFileName = function(filePath){
      return filePath.replace(/^.*[\\\/]/, '');
    };

    var getFileExtension = function(fileName){
      return fileName.split('.').pop();
    };

    var getFileNameWithoutExtension = function(fileName, fileExtension){
      return fileName.substring(0, fileName.length - fileExtension.length - 1);
    };

    var hasSchedulingChanged = function(model){
      if(model.input.scheduleMode !== model.savedScheduleMode){
        return true;
      }

      if(model.input.scheduleMode === scheduleModes.scheduled){
        return !areDatesEqual(model.savedDate, model.input.date);
      }

      return false;
    };

    service.internal.saveContent = function(postId, model){
      return postStub.putPost(postId, {
        imageId: model.input.image ? model.input.image.fileId : undefined,
        fileId: model.input.file ? model.input.file.fileId : undefined,
        comment: model.input.comment
      });
    };

    service.internal.saveSchedule = function(postId, model){
      if(hasSchedulingChanged(model)){
        if(model.input.scheduleMode === scheduleModes.now){
          return postStub.postToLive(postId);
        }
        else if(model.input.scheduleMode === scheduleModes.queued){
          return postStub.putQueue(postId, model.input.selectedQueue.queueId);
        }
        else if(model.input.scheduleMode === scheduleModes.scheduled){
          return postStub.putLiveDate(postId, model.input.date);
        }
      }

      return $q.when();
    };

    service.getFileInformation = function(data){
      var fileName = getFileName(data.file.name);
      var fileExtension = getFileExtension(fileName);
      var fileNameWithoutExtension = getFileNameWithoutExtension(fileName, fileExtension);
      return {
        file: {
          fileId: data.fileId,
          containerName: data.containerName
        },
        fileSource: {
          fileName: fileNameWithoutExtension,
          fileExtension: fileExtension,
          contentType: data.file.type,
          size: data.file.size
        }
      };
    };

    service.performSave = function(postId, model){
      return service.internal.saveContent(postId, model)
        .then(function(){
          return service.internal.saveSchedule(postId, model);
        });
    };

    service.applyChangesToPost = function(post, model){
      post.comment = model.input.comment;

      post.file = model.input.file;
      post.fileSource = model.input.fileSource;

      post.image = model.input.image;
      post.imageSource = model.input.imageSource;

      // When requesting posts from the API, backlog posts
      // have a queueId property where as timeline
      // posts do not.  Therefore the presence of this property
      // is used by postUtilities to determine if a post is scheduled.
      // We replicate that here by removing the property for
      // non-scheduled posts.
      if(hasSchedulingChanged(model)){
        if(model.input.scheduleMode === scheduleModes.now){
          delete post.queueId;
          post.liveDate = new Date().toISOString();
        }
        else if(model.input.scheduleMode === scheduleModes.queued){
          post.queueId = model.input.selectedQueue.queueId;
          post.liveDate = model.queuedLiveDate.toISOString();
        }
        else if(model.input.scheduleMode === scheduleModes.scheduled){
          var now = moment();
          if(now.isBefore(model.input.date)){
            post.queueId = undefined;
          }
          else{
            // The post is live.
            delete post.queueId;
          }
          post.liveDate = model.input.date.toISOString();
        }
      }

      return postUtilities.processPostForRendering(post);
    };

    return service;
  });
