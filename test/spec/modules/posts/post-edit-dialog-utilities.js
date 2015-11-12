describe('post-edit-dialog-utilities', function() {
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var postEditDialogConstants;
  var scheduleModes;

  var postStub;
  var postUtilities;

  beforeEach(function () {
    postUtilities = jasmine.createSpyObj('postUtilities', ['processPostForRendering']);
    postStub = jasmine.createSpyObj('postStub', ['getPost', 'putPost', 'postToLive', 'putQueue', 'putLiveDate']);

    module('webApp');

    module(function ($provide) {
      $provide.value('postUtilities', postUtilities);
      $provide.value('postStub', postStub);
    });

    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('postEditDialogUtilities');

      postEditDialogConstants = $injector.get('postEditDialogConstants');
      scheduleModes = postEditDialogConstants.scheduleModes;
    });
  });

  describe('when calling getPostData', function(){
    it('should translate the data', function(){
      var model = {
        input: {
          content: {
            serializedBlocks: 'serializedBlocks',
            files: [
              {
                name: 'name1',
                fileId: 'fileId1'
              },
              {
                name: 'name2',
                fileId: 'fileId2'
              }
            ],
            imageCount: 'imageCount',
            fileCount: 'fileCount',
            videoCount: 'videoCount',
            previewWordCount: 'previewWordCount',
            wordCount: 'wordCount',
            previewText: 'previewText',
            previewImageId: 'previewImageId'
          }
        }
      };

      var result = target.internal.getPostData(model);

      expect(result).toEqual({
        content: 'serializedBlocks',
        fileIds: ['fileId1', 'fileId2'],
        imageCount: 'imageCount',
        fileCount: 'fileCount',
        videoCount: 'videoCount',
        previewWordCount: 'previewWordCount',
        wordCount: 'wordCount',
        previewText: 'previewText',
        previewImageId: 'previewImageId'
      });
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
    var result;
    beforeEach(function(){
      spyOn(target.internal, 'getPostData').and.returnValue('postData');
      postStub.putPost.and.returnValue('postResult');
      result = target.internal.saveContent('postId', 'model');
    });

    it('should call getPostData', function(){
      expect(target.internal.getPostData).toHaveBeenCalledWith('model');
    });

    it('should call putPost', function(){
      expect(postStub.putPost).toHaveBeenCalledWith('postId', 'postData');
    });

    it('should return the result', function(){
      expect(result).toBe('postResult');
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
          date: 'date',
          selectedQueue: {
            queueId: 'queueId'
          }
        }
      };

      postStub.postToLive.and.returnValue('postToLiveResult');
      postStub.putQueue.and.returnValue('putQueueResult');
      postStub.putLiveDate.and.returnValue('putLiveDateResult');
    });

    describe('when the schedule mode has not changed', function(){
      var result;
      beforeEach(function(){
        model.savedScheduleMode = scheduleModes.now;
        model.input.scheduleMode = scheduleModes.now;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should not call postToLive', function(){
        expect(postStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call putQueue', function(){
        expect(postStub.putQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postStub.putLiveDate).not.toHaveBeenCalled();
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
        expect(postStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call putQueue', function(){
        expect(postStub.putQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postStub.putLiveDate).not.toHaveBeenCalled();
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
        expect(postStub.postToLive).toHaveBeenCalledWith('postId');
      });

      it('should not call putQueue', function(){
        expect(postStub.putQueue).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postStub.putLiveDate).not.toHaveBeenCalled();
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

      it('should call putQueue', function(){
        expect(postStub.putQueue).toHaveBeenCalledWith('postId', 'queueId');
      });

      it('should not call postToLive', function(){
        expect(postStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call putLiveDate', function(){
        expect(postStub.putLiveDate).not.toHaveBeenCalled();
      });

      it('should return the result', function(){
        expect(result).toBe('putQueueResult');
      });
    });

    describe('when the schedule mode has changed to scheduled', function(){
      var result;
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.scheduled;
        result = target.internal.saveSchedule(postId, model);
      });

      it('should call putLiveDate', function(){
        expect(postStub.putLiveDate).toHaveBeenCalledWith('postId', 'date');
      });

      it('should not call postToLive', function(){
        expect(postStub.postToLive).not.toHaveBeenCalled();
      });

      it('should not call putQueue', function(){
        expect(postStub.putQueue).not.toHaveBeenCalled();
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

  describe('when calling applyContentChangesToPost', function(){
    var post;
    var model;

    beforeEach(function(){
      post = {
        channelId: 'channelId'
      };
      model = {
        input: {
          selectedQueue: {
            image: 'image',
            imageSource: 'imageSource'
          },
          content: {
            previewText: 'previewText',
            previewImageId: 'fileId2',
            files: [
              {
                name: 'file1',
                fileId: 'fileId1',
                containerName: 'cn1',
                renderSize: 's1'
              },
              {
                name: 'file2',
                fileId: 'fileId2',
                containerName: 'cn2',
                renderSize: 's2'
              }
            ]
          }
        }
      };
    });

    describe('when preview image ID exists', function(){
      beforeEach(function(){
        target.internal.applyContentChangesToPost(post, model);
      });

      it('should apply changes to post', function(){
        expect(post).toEqual({
          channelId: 'channelId',
          previewText: 'previewText',
          image: {fileId: 'fileId2', containerName: 'cn2'},
          imageSource: { renderSize: 's2'}
        });
      });
    });

    describe('when preview image ID does not exist', function(){
      beforeEach(function(){
        model.input.content.previewImageId = undefined;
        target.internal.applyContentChangesToPost(post, model);
      });

      it('should apply changes to post', function(){
        expect(post).toEqual({
          channelId: 'channelId',
          previewText: 'previewText',
          image: undefined,
          imageSource: undefined
        });
      });
    });
  });

  describe('when calling applySchedulingChangesToPost', function(){
    var post;
    var model;
    var inputDate;
    var pastInputDate;
    var queuedLiveDate;
    var nowDate;
    beforeEach(function(){
      nowDate = new Date('2015-05-01T08:00:00Z');
      inputDate = new Date('2015-05-01T12:00:00Z');
      pastInputDate = new Date('2015-05-01T05:00:00Z');
      queuedLiveDate = new Date('2015-05-01T17:30:00Z');
      jasmine.clock().install();
      jasmine.clock().mockDate(nowDate);

      post = {
        channelId: 'channelId'
      };
      model = {
        input: {
          selectedQueue: {
            queueId: 'queueId'
          },
          scheduleMode: undefined,
          date: inputDate
        },
        queuedLiveDate: queuedLiveDate,
        postType: undefined
      };
    });

    afterEach(function(){
      jasmine.clock().uninstall();
    });

    describe('when the scheduleMode is now', function(){
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.now;
        target.internal.applySchedulingChangesToPost(post, model);
      });

      it('should not have a queueId property', function(){
        expect(_.has(post, 'queueId')).toBe(false);
      });

      it('should have a live date of now', function(){
        expect(post.liveDate).toBe(nowDate.toISOString());
      });
    });

    describe('when the scheduleMode is queued', function(){
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.queued;
        target.internal.applySchedulingChangesToPost(post, model);
      });

      it('should set queueId', function(){
        expect(post.queueId).toBe('queueId');
      });

      it('should have a live date of the queue live date', function(){
        expect(post.liveDate).toBe(queuedLiveDate.toISOString());
      });
    });

    var runScheduleDateExpectations = function(){
      it('should set queueId to be undefined', function(){
        if(model.input.date === pastInputDate){
          expect(_.has(post, 'queueId')).toBe(false);
        }
        else{
          expect(_.has(post, 'queueId')).toBe(true);
          expect(post.queueId).toBeUndefined();
        }
      });

      it('should have a live date of the input date', function(){
        if(model.input.date === pastInputDate) {
          expect(post.liveDate).toBe(pastInputDate.toISOString());
        }
        else{
          expect(post.liveDate).toBe(inputDate.toISOString());
        }
      });
    };

    describe('when the scheduleMode is scheduled', function(){
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.scheduled;
        target.internal.applySchedulingChangesToPost(post, model);
      });

      runScheduleDateExpectations();
    });

    describe('when the scheduleMode is scheduled in the past', function(){
      beforeEach(function(){
        model.input.scheduleMode = scheduleModes.scheduled;
        model.input.date = pastInputDate;
        target.internal.applySchedulingChangesToPost(post, model);
      });

      runScheduleDateExpectations();
    });
  });

  describe('when calling applyChangesToPost', function() {
    var result;
    beforeEach(function(){
      spyOn(target.internal, 'applyContentChangesToPost');
      spyOn(target.internal, 'applySchedulingChangesToPost');
      postUtilities.processPostForRendering.and.returnValue('result');

      result = target.applyChangesToPost('post', 'model', 'accountSettingsRepository', 'blogRepository', 'subscriptionRepository');
    });

    it('should call applyContentChangesToPost', function(){
      expect(target.internal.applyContentChangesToPost).toHaveBeenCalledWith('post', 'model');
    });

    it('should call applySchedulingChangesToPost', function(){
      expect(target.internal.applySchedulingChangesToPost).toHaveBeenCalledWith('post', 'model');
    });

    it('should have called processPostForRendering', function(){
      expect(postUtilities.processPostForRendering).toHaveBeenCalledWith('post', 'accountSettingsRepository', 'blogRepository', 'subscriptionRepository');
    });

    it('should return the result', function(){
      expect(result).toBe('result');
    });
  });

  describe('assignQueueIdIfRequired', function(){
    it('should not add a queueId field if not scheduled', function(){
      var initial = {
        isScheduled: false,
        queueId: 'queueId'
      };

      var post = {
        postId: 'postId'
      };

      target.internal.assignQueueIdIfRequired(initial, post);

      expect(post).toEqual({
        postId: 'postId'
      });
    });

    it('should not add queueId field if scheduled', function(){
      var initial = {
        isScheduled: true,
        queueId: undefined
      };

      var post = {
        postId: 'postId'
      };

      target.internal.assignQueueIdIfRequired(initial, post);

      expect(post).toEqual({
        postId: 'postId',
        queueId: undefined
      });
    });

    it('should not add queueId field if scheduled on queue', function(){
      var initial = {
        isScheduled: true,
        queueId: 'queueId'
      };

      var post = {
        postId: 'postId'
      };

      target.internal.assignQueueIdIfRequired(initial, post);

      expect(post).toEqual({
        postId: 'postId',
        queueId: 'queueId'
      });
    });
  });

  describe('when calling getFullPost', function(){
    var result;
    var error;
    var deferredGetPost;
    var deferredProcessPostForRendering;
    var initialPost;
    beforeEach(function(){
      result = undefined;
      error = undefined;

      deferredGetPost = $q.defer();
      postStub.getPost.and.returnValue(deferredGetPost.promise);

      deferredProcessPostForRendering = $q.defer();
      postUtilities.processPostForRendering.and.returnValue(deferredProcessPostForRendering.promise);

      spyOn(target.internal, 'assignQueueIdIfRequired');

      initialPost = {
        postId: 'postId'
      };

      target.getFullPost(initialPost, 'accountSettingsRepository', 'blogRepository', 'subscriptionRepository')
        .then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getPost', function(){
      expect(postStub.getPost).toHaveBeenCalledWith('postId');
    });

    describe('when getPost succeeds', function(){
      var expectedPost;
      beforeEach(function(){
        deferredGetPost.resolve({
          data: {
            post: { name: 'post' },
            files: 'files'
          }
        });

        expectedPost = {
          name: 'post',
          files: 'files'
        };

        $rootScope.$apply();
      });

      it('should call assignQueueIdIfRequired', function(){
        expect(target.internal.assignQueueIdIfRequired).toHaveBeenCalledWith(initialPost, expectedPost);
      });

      it('should call processPostForRendering', function(){
        expect(postUtilities.processPostForRendering).toHaveBeenCalledWith(
          expectedPost,
          'accountSettingsRepository',
          'blogRepository',
          'subscriptionRepository');
      });

      describe('when processPostForRendering succeeds', function(){
        beforeEach(function(){
          deferredProcessPostForRendering.resolve();
          $rootScope.$apply();
        });

        it('should return the post', function(){
          expect(result).toEqual(expectedPost);
        });
      });

      describe('when processPostForRendering fails', function(){
        beforeEach(function(){
          deferredProcessPostForRendering.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getPost fails', function(){
      beforeEach(function(){
        deferredGetPost.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });
});
