describe('post-edit-dialog-utilities', function() {
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var postEditDialogConstants;
  var postTypes;
  var scheduleModes;

  var postsStub;
  var postUtilities;

  beforeEach(function () {
    postUtilities = jasmine.createSpyObj('postUtilities', ['processPostForRendering']);
    postsStub = jasmine.createSpyObj('postsStub', ['putNote', 'putFile', 'putImage', 'postToLive', 'postToQueue', 'putLiveDate']);

    module('webApp');

    module(function ($provide) {
      $provide.value('postUtilities', postUtilities);
      $provide.value('postsStub', postsStub);
    });

    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('postEditDialogUtilities');

      postEditDialogConstants = $injector.get('postEditDialogConstants');
      postTypes = postEditDialogConstants.postTypes;
      scheduleModes = postEditDialogConstants.scheduleModes;
    });
  });

  describe('when calling getFileInformation', function(){
    var data;
    beforeEach(function(){
      data = {
        fileId: 'fileId',
        containerName: 'containerName',
        file: {
          name: undefined,
          type: 'content/type',
          size: 1234
        }
      };
    });

    it('should populate the file and fileSource correctly', function(){
      data.file.name = 'file.txt';
      var result = target.getFileInformation(data);

      expect(result).toEqual({
        file:{
          fileId: 'fileId',
          containerName: 'containerName'
        },
        fileSource: {
          fileName: 'file',
          fileExtension: 'txt',
          contentType: 'content/type',
          size: 1234
        }
      });
    });

    it('should support full windows paths', function(){
      data.file.name = 'C:\\some.folder\\some other folder\\a-useful.file.txt';
      var result = target.getFileInformation(data);
      expect(result.fileSource.fileName).toBe('a-useful.file');
      expect(result.fileSource.fileExtension).toBe('txt');
    });

    it('should support full windows paths', function(){
      data.file.name = '/documents/some.folder/a space/a-useful.file.txt';
      var result = target.getFileInformation(data);
      expect(result.fileSource.fileName).toBe('a-useful.file');
      expect(result.fileSource.fileExtension).toBe('txt');
    });

    it('should support simple file names', function(){
      data.file.name = 'a.txt';
      var result = target.getFileInformation(data);
      expect(result.fileSource.fileName).toBe('a');
      expect(result.fileSource.fileExtension).toBe('txt');
    });

    it('should support simple complex names', function(){
      data.file.name = '1 2.hello-_blah!.some_extension';
      var result = target.getFileInformation(data);
      expect(result.fileSource.fileName).toBe('1 2.hello-_blah!');
      expect(result.fileSource.fileExtension).toBe('some_extension');
    });
  });

  describe('when calling saveContent', function(){
    var model;
    var postId;
    beforeEach(function(){
      postId = 'postId';
      model = {
        postType: 'unknown',
        input: {
          selectedChannel: {
            channelId: 'channelId'
          },
          comment: 'comment',
          file: {
            fileId: 'fileId'
          },
          image: {
            fileId: 'imageId'
          }
        }
      };

      postsStub.putNote.and.returnValue('noteResult');
      postsStub.putFile.and.returnValue('fileResult');
      postsStub.putImage.and.returnValue('imageResult');
    });

    describe('when saving a note', function(){
      var result;
      beforeEach(function(){
        model.postType = postTypes.note;
        result = target.internal.saveContent(postId, model);
      });

      it('should call putNote', function(){
        expect(postsStub.putNote).toHaveBeenCalledWith('postId', {
          channelId: 'channelId',
          note: 'comment'
        });
      });

      it('should not call putFile', function(){
        expect(postsStub.putFile).not.toHaveBeenCalled();
      });

      it('should not call putImage', function(){
        expect(postsStub.putImage).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('noteResult');
      });
    });

    describe('when saving a file', function(){
      var result;
      beforeEach(function(){
        model.postType = postTypes.file;
        result = target.internal.saveContent(postId, model);
      });

      it('should call putFile', function(){
        expect(postsStub.putFile).toHaveBeenCalledWith('postId', {
          fileId: 'fileId',
          comment: 'comment'
        });
      });

      it('should not call putNote', function(){
        expect(postsStub.putNote).not.toHaveBeenCalled();
      });

      it('should not call putImage', function(){
        expect(postsStub.putImage).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('fileResult');
      });
    });

    describe('when saving an image', function(){
      var result;
      beforeEach(function(){
        model.postType = postTypes.image;
        result = target.internal.saveContent(postId, model);
      });

      it('should call putImage', function(){
        expect(postsStub.putImage).toHaveBeenCalledWith('postId', {
          imageFileId: 'imageId',
          comment: 'comment'
        });
      });

      it('should not call putNote', function(){
        expect(postsStub.putNote).not.toHaveBeenCalled();
      });

      it('should not call putFile', function(){
        expect(postsStub.putFile).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('imageResult');
      });
    });

    describe('when saving an unknown type', function(){
      var result;
      beforeEach(function(){
        result = target.internal.saveContent(postId, model);
      });

      it('should not call putImage', function(){
        expect(postsStub.putImage).not.toHaveBeenCalled();
      });

      it('should not call putNote', function(){
        expect(postsStub.putNote).not.toHaveBeenCalled();
      });

      it('should not call putFile', function(){
        expect(postsStub.putFile).not.toHaveBeenCalled();
      });

      it('should return the a resolved promise', function(){
        var isComplete = false;
        result.then(function(){ isComplete = true; });
        $rootScope.$apply();
        expect(isComplete).toBe(true);
      });
    });
  });

  describe('when calling saveSchedule', function(){
    var postId;
    var model;
    beforeEach(function(){
      postId = 'postId';
      model = {
        savedScheduleMode: 'unknown',
        input: {
          scheduleMode: 'unknown',
          date: 'date'
        }
      };

      postsStub.postToLive.and.returnValue('postToLiveResult');
      postsStub.postToQueue.and.returnValue('postToQueueResult');
      postsStub.putLiveDate.and.returnValue('putLiveDateResult');
    });

    describe('when the schedule mode has not changed', function(){
      var result;
      beforeEach(function(){
        model.savedScheduleMode = scheduleModes.now;
        model.input.scheduleMode = scheduleModes.now;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should not call postToLive', function(){
        expect(postsStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call postToQueue', function(){
        expect(postsStub.postToQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postsStub.putLiveDate).not.toHaveBeenCalled();
      });

      it('should return the a resolved promise', function(){
        var isComplete = false;
        result.then(function(){ isComplete = true; });
        $rootScope.$apply();
        expect(isComplete).toBe(true);
      });
    });

    describe('when the schedule mode is not known', function(){
      var result;
      beforeEach(function(){
        model.savedScheduleMode = scheduleModes.now;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should not call postToLive', function(){
        expect(postsStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call postToQueue', function(){
        expect(postsStub.postToQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postsStub.putLiveDate).not.toHaveBeenCalled();
      });

      it('should return the a resolved promise', function(){
        var isComplete = false;
        result.then(function(){ isComplete = true; });
        $rootScope.$apply();
        expect(isComplete).toBe(true);
      });
    });

    describe('when the schedule mode has changed to now', function(){
      var result;
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.now;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should call postToLive', function(){
        expect(postsStub.postToLive).toHaveBeenCalledWith('postId');
      });

      it('should not call postToQueue', function(){
        expect(postsStub.postToQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postsStub.putLiveDate).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('postToLiveResult');
      });
    });

    describe('when the schedule mode has changed to queued', function(){
      var result;
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.queued;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should call postToQueue', function(){
        expect(postsStub.postToQueue).toHaveBeenCalledWith('postId');
      });

      it('should not call postToLive', function(){
        expect(postsStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postsStub.putLiveDate).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('postToQueueResult');
      });
    });

    describe('when the schedule mode has changed to scheduled', function(){
      var result;
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.scheduled;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should call putLiveDate', function(){
        expect(postsStub.putLiveDate).toHaveBeenCalledWith('postId', 'date');
      });

      it('should not call postToLive', function(){
        expect(postsStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call postToQueue', function(){
        expect(postsStub.postToQueue).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('putLiveDateResult');
      });
    });
  });

  describe('when calling performSave', function(){
    beforeEach(function(){
      spyOn(target.internal, 'saveContent').and.returnValue($q.when());
      spyOn(target.internal, 'saveSchedule').and.returnValue($q.when('result'));
    });

    describe('when successful', function(){
      var result;
      beforeEach(function(){
        target.performSave('postId', 'model')
          .then(function(r){
            result = r;
          });
        $rootScope.$apply();
      });

      it('should call saveContent', function(){
        expect(target.internal.saveContent).toHaveBeenCalledWith('postId', 'model');
      });

      it('should call saveSchedule', function(){
        expect(target.internal.saveSchedule).toHaveBeenCalledWith('postId', 'model');
      });

      it('should return the result', function(){
        expect(result).toBe('result');
      });
    });

    describe('when saveContent fails', function(){
      var result;
      beforeEach(function(){
        target.internal.saveContent.and.returnValue($q.reject('error'));
        target.performSave('postId', 'model')
          .catch(function(r){
            result = r;
          });
        $rootScope.$apply();
      });

      it('should call saveContent', function(){
        expect(target.internal.saveContent).toHaveBeenCalledWith('postId', 'model');
      });

      it('should not call saveSchedule', function(){
        expect(target.internal.saveSchedule).not.toHaveBeenCalled();
      });

      it('should return the error', function(){
        expect(result).toBe('error');
      });
    });

    describe('when saveSchedule fails', function(){
      var result;
      beforeEach(function(){
        target.internal.saveSchedule.and.returnValue($q.reject('error'));
        target.performSave('postId', 'model')
          .catch(function(r){
            result = r;
          });
        $rootScope.$apply();
      });

      it('should call saveContent', function(){
        expect(target.internal.saveContent).toHaveBeenCalledWith('postId', 'model');
      });

      it('should call saveSchedule', function(){
        expect(target.internal.saveSchedule).toHaveBeenCalledWith('postId', 'model');
      });

      it('should return the error', function(){
        expect(result).toBe('error');
      });
    });
  });

  describe('when calling applyChangesToPost', function(){
    var post;
    var model;
    var result;
    var inputDate;
    var queuedLiveDate;
    var nowDate;
    beforeEach(function(){
      nowDate = new Date('2015-05-01T08:00:00Z');
      inputDate = new Date('2015-05-01T12:00:00Z');
      queuedLiveDate = new Date('2015-05-01T17:30:00Z');
      jasmine.clock().install();
      jasmine.clock().mockDate(nowDate);

      post = {
        scheduleByQueue: 'scheduleByQueue'
      };
      model = {
        input: {
          selectedChannel: {
            channelId: 'channelId'
          },
          selectedCollection: {
            collectionId: 'collectionId'
          },
          comment: 'comment',
          file: 'file',
          fileSource: 'fileSource',
          image: 'image',
          imageSource: 'imageSource',
          scheduleMode: undefined,
          date: inputDate
        },
        queuedLiveDate: queuedLiveDate,
        postType: undefined
      };

      postUtilities.processPostForRendering.and.returnValue('result');
    });

    afterEach(function(){
      jasmine.clock().uninstall();
    });

    var runStandardExpectations = function(){
      it('should apply standard changes to the post', function(){
        expect(post.channelId).toBe('channelId');
        expect(post.comment).toBe('comment');
        expect(post.file).toBe('file');
        expect(post.fileSource).toBe('fileSource');
        expect(post.image).toBe('image');
        expect(post.imageSource).toBe('imageSource');
      });

      it('should have called processPostForRendering', function(){
        expect(postUtilities.processPostForRendering).toHaveBeenCalledWith(post);
      });
    };

    var runResultExpectations = function(){
      it('should return the result', function(){
        expect(result).toBe('result');
      });
    };

    var runNoteExpectations = function(){
      it('should not have set the collection id', function(){
        expect(_.has(post, 'collectionId')).toBe(false);
      });
    };

    var runFileAndImageExpectations = function(){
      it('should have set the collection id', function(){
        expect(post.collectionId).toBe('collectionId');
      });
    };

    var runScheduleNowExpectations = function(){
      it('should not have a scheduledByQueue property', function(){
        expect(_.has(post, 'scheduledByQueue')).toBe(false);
      });

      it('should have a live date of now', function(){
        expect(post.liveDate).toBe(nowDate.toISOString());
      });
    };

    var runScheduleQueuedExpectations = function(){
      it('should set scheduledByQueue to be true', function(){
        expect(post.scheduledByQueue).toBe(true);
      });

      it('should have a live date of the queue live date', function(){
        expect(post.liveDate).toBe(queuedLiveDate.toISOString());
      });
    };

    var runScheduleDateExpectations = function(){
      it('should set scheduledByQueue to be false', function(){
        expect(post.scheduledByQueue).toBe(false);
      });

      it('should have a live date of the input date', function(){
        expect(post.liveDate).toBe(inputDate.toISOString());
      });
    };

    describe('when the post is a note', function(){
      describe('when the scheduleMode is now', function(){
        beforeEach(function(){
          model.postType = postTypes.note;
          model.input.scheduleMode = scheduleModes.now;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runNoteExpectations();
        runScheduleNowExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is queued', function(){
        beforeEach(function(){
          model.postType = postTypes.note;
          model.input.scheduleMode = scheduleModes.queued;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runNoteExpectations();
        runScheduleQueuedExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is scheduled', function(){
        beforeEach(function(){
          model.postType = postTypes.note;
          model.input.scheduleMode = scheduleModes.scheduled;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runNoteExpectations();
        runScheduleDateExpectations();
        runResultExpectations();
      });
    });

    describe('when the post is a file', function(){
      describe('when the scheduleMode is now', function(){
        beforeEach(function(){
          model.postType = postTypes.file;
          model.input.scheduleMode = scheduleModes.now;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleNowExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is queued', function(){
        beforeEach(function(){
          model.postType = postTypes.file;
          model.input.scheduleMode = scheduleModes.queued;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleQueuedExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is scheduled', function(){
        beforeEach(function(){
          model.postType = postTypes.file;
          model.input.scheduleMode = scheduleModes.scheduled;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleDateExpectations();
        runResultExpectations();
      });
    });

    describe('when the post is a image', function(){
      describe('when the scheduleMode is now', function(){
        beforeEach(function(){
          model.postType = postTypes.image;
          model.input.scheduleMode = scheduleModes.now;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleNowExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is queued', function(){
        beforeEach(function(){
          model.postType = postTypes.image;
          model.input.scheduleMode = scheduleModes.queued;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleQueuedExpectations();
        runResultExpectations();
      });

      describe('when the scheduleMode is scheduled', function(){
        beforeEach(function(){
          model.postType = postTypes.image;
          model.input.scheduleMode = scheduleModes.scheduled;
          result = target.applyChangesToPost(post, model);
        });

        runStandardExpectations();
        runFileAndImageExpectations();
        runScheduleDateExpectations();
        runResultExpectations();
      });
    });
  });
});
