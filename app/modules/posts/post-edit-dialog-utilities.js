angular.module('webApp').factory('postEditDialogUtilities',
  function($q, postEditDialogConstants, postsStub, postUtilities) {
    'use strict';

    var postTypes = postEditDialogConstants.postTypes;
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
      if(model.postType === postTypes.note){
        return postsStub.putNote(postId, {
          channelId: model.input.selectedChannel.channelId,
          note: model.input.comment
        });
      }
      else if(model.postType === postTypes.file){
        return postsStub.putFile(postId, {
          fileId: model.input.file.fileId,
          comment: model.input.comment
        });
      }
      else if(model.postType === postTypes.image){
        return postsStub.putImage(postId, {
          imageFileId: model.input.image.fileId,
          comment: model.input.comment
        });
      }

      return $q.when();
    };

    service.internal.saveSchedule = function(postId, model){
      if(hasSchedulingChanged(model)){
        if(model.input.scheduleMode === scheduleModes.now){
          return postsStub.postToLive(postId);
        }
        else if(model.input.scheduleMode === scheduleModes.queued){
          return postsStub.postToQueue(postId);
        }
        else if(model.input.scheduleMode === scheduleModes.scheduled){
          return postsStub.putLiveDate(postId, model.input.date);
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
      post.channelId = model.input.selectedChannel.channelId;

      if(model.postType !== postTypes.note){
        post.collectionId = model.input.selectedCollection.collectionId;
      }

      post.comment = model.input.comment;

      post.file = model.input.file;
      post.fileSource = model.input.fileSource;

      post.image = model.input.image;
      post.imageSource = model.input.imageSource;

      if(hasSchedulingChanged(model)){
        if(model.input.scheduleMode === scheduleModes.now){
          delete post.scheduledByQueue;
          post.liveDate = new Date().toISOString();
        }
        else if(model.input.scheduleMode === scheduleModes.queued){
          post.scheduledByQueue = true;
          post.liveDate = model.queuedLiveDate.toISOString();
        }
        else if(model.input.scheduleMode === scheduleModes.scheduled){
          post.scheduledByQueue = false;
          post.liveDate = model.input.date.toISOString();
        }
      }

      return postUtilities.processPostForRendering(post);
    };

    return service;
  });
