describe('post-edit-dialog-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var postEditDialogConstants;
  var scheduleModes;

  var initialPost;
  var post;
  var postId;
  var composeUtilities;
  var blobImageControlFactory;
  var postEditDialogUtilities;
  var errorFacade;
  var initializer;
  var blogRepositoryFactory;
  var blogRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;

  var liveDateString;
  var roundedDateString;

  beforeEach(function () {

    liveDateString = '2015-06-01T05:05:05Z';
    roundedDateString = '2015-06-01T05:05:00Z';
    postId = 'postId';
    initialPost = {
      postId: postId
    };

    post = {
      postId: postId,
      liveDate: liveDateString,
      comment: 'comment',
      image: 'image',
      imageSource: 'imageSource',
      file: 'file',
      fileSource: 'fileSource',
      channelId: 'b',
      channel: {
        channelId: 'b'
      },
      queue: {
        queueId: 'b'
      }
    };
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['updateEstimatedLiveDate']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    postEditDialogUtilities = jasmine.createSpyObj('postEditDialogUtilities', ['getFileInformation', 'performSave', 'applyChangesToPost', 'getFullPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getQueuesSorted']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getUserId']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getUserId']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);

    module('webApp');
    module(function ($provide) {
      $provide.value('initialPost', initialPost);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('postEditDialogUtilities', postEditDialogUtilities);
      $provide.value('errorFacade', errorFacade);
      $provide.value('initializer', initializer);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      postEditDialogConstants = $injector.get('postEditDialogConstants');
      scheduleModes = postEditDialogConstants.scheduleModes;
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('postEditDialogCtrl', {$scope: $scope});
    });
  };

  describe('when creating', function(){


    beforeEach(function(){
      createController();
    });


    it('should get the blob repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get the account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get the subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should call initializer with the initialize function', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.initialize);
    });

    it('should assign scheduleModes to scope', function(){
      expect($scope.scheduleModes).toEqual(scheduleModes);
    });

    describe('when createModelFromPost is called', function(){

      var expectedScheduleMode;
      var result;

      var runExpectations = function(){
        it('should initialize the model', function(){
          expect(result).toEqual({
            savedScheduleMode: expectedScheduleMode,
            savedDate: new Date(liveDateString),
            queuedLiveDate: undefined,
            channelId: 'b',
            isProcessing: false,
            input: {
              comment: 'comment',
              image: 'image',
              imageSource: 'imageSource',
              file: 'file',
              fileSource: 'fileSource',
              date: new Date(roundedDateString),
              scheduleMode: expectedScheduleMode
            }
          });
        });
      };

      describe('when scheduled now', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.now;
          post.isScheduled = false;

          result = target.internal.createModelFromPost(post);
          $scope.$apply();
        });

        runExpectations();
      });

      describe('when scheduled queue', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.queued;
          post.isScheduled = true;
          post.queueId = 'b';

          result = target.internal.createModelFromPost(post);
          $scope.$apply();
        });

        runExpectations();
      });

      describe('when scheduled date', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.scheduled;
          post.isScheduled = true;
          post.queueId = undefined;

          result = target.internal.createModelFromPost(post);
          $scope.$apply();
        });

        runExpectations();
      });
    });

    describe('when watchForBusyBlocks is called', function(){
      beforeEach(function(){
        spyOn($scope, '$watch').and.callThrough();
        target.internal.watchForBusyBlocks();
      });

      it('should configure the watch', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.content', target.internal.updateIsProcessing);
      });
    });

    describe('when updateIsProcessing is called', function(){
      beforeEach(function(){
        $scope.model.input = {};
      });

      it('should set isProcessing to false if no content', function(){
        $scope.model.input.content = undefined;
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if no content', function(){
        $scope.model.input.content = undefined;
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if no busy blocks', function(){
        $scope.model.input.content = { busyBlockCount: 0 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(false);
      });

      it('should set isProcessing to false if one busy block', function(){
        $scope.model.input.content = { busyBlockCount: 1 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(true);
      });

      it('should set isProcessing to false if many busy block', function(){
        $scope.model.input.content = { busyBlockCount: 4 };
        target.internal.updateIsProcessing();
        expect($scope.model.isProcessing).toBe(true);
      });
    });

    describe('when save is called', function(){
      beforeEach(function(){
        target.internal.postId = postId;
        target.internal.post = post;
        $scope.model = 'model';
        $scope.$close = jasmine.createSpy('$close');
      });

      describe('when successful', function(){
        beforeEach(function(){
          postEditDialogUtilities.performSave.and.returnValue($q.when());
          postEditDialogUtilities.applyChangesToPost.and.returnValue($q.when());
          $scope.save();
          $scope.$apply();
        });

        it('should call performSave', function(){
          expect(postEditDialogUtilities.performSave).toHaveBeenCalledWith('postId', $scope.model);
        });

        it('should call applyChangesToPost', function(){
          expect(postEditDialogUtilities.applyChangesToPost).toHaveBeenCalledWith(
            post, $scope.model, accountSettingsRepository, blogRepository, subscriptionRepository);
        });

        it('should close the dialog passing the updated post', function(){
          expect($scope.$close).toHaveBeenCalledWith(post);
        });
      });

      describe('when performSave fails', function(){
        var error;
        beforeEach(function(){
          postEditDialogUtilities.performSave.and.returnValue($q.reject('error'));
          postEditDialogUtilities.applyChangesToPost.and.returnValue($q.when());
          $scope.save().catch(function(e) { error = e; });
          $scope.$apply();
        });

        it('should call performSave', function(){
          expect(postEditDialogUtilities.performSave).toHaveBeenCalledWith('postId', $scope.model);
        });

        it('should not call applyChangesToPost', function(){
          expect(postEditDialogUtilities.applyChangesToPost).not.toHaveBeenCalled();
        });

        it('should not close the dialog', function(){
          expect($scope.$close).not.toHaveBeenCalled();
        });

        it('should return the error', function(){
          expect(error).toBe('error');
        });
      });

      describe('when applyChangesToPost fails', function(){
        var error;
        beforeEach(function(){
          postEditDialogUtilities.performSave.and.returnValue($q.when());
          postEditDialogUtilities.applyChangesToPost.and.returnValue($q.reject('error'));
          $scope.save().catch(function(e) { error = e; });
          $scope.$apply();
        });

        it('should call performSave', function(){
          expect(postEditDialogUtilities.performSave).toHaveBeenCalledWith('postId', $scope.model);
        });

        it('should call applyChangesToPost', function(){
          expect(postEditDialogUtilities.applyChangesToPost).toHaveBeenCalledWith(
            post, $scope.model, accountSettingsRepository, blogRepository, subscriptionRepository);
        });

        it('should not close the dialog', function(){
          expect($scope.$close).not.toHaveBeenCalled();
        });

        it('should return the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when onInputDateChanged is called', function(){
      beforeEach(function(){
        $scope.model.input = {};
      });

      describe('when the dates have not changed', function(){
        beforeEach(function(){
          $scope.model.input.scheduleMode = 'original';
          target.internal.onInputDateChanged(new Date(roundedDateString), new Date(roundedDateString));
          $scope.$apply();
        });

        it('should not change the schedule mode', function(){
          expect($scope.model.input.scheduleMode).toBe('original');
        });
      });

      describe('when the dates have changed', function(){
        beforeEach(function(){
          $scope.model.input.scheduleMode = 'original';
          target.internal.onInputDateChanged(new Date(roundedDateString), new Date(liveDateString));
          $scope.$apply();
        });

        it('should change the schedule mode to scheduled', function(){
          expect($scope.model.input.scheduleMode).toBe(scheduleModes.scheduled);
        });
      });
    });

    describe('when onSelectedQueueChanged is called', function(){
      beforeEach(function(){
        $scope.model.input = {};
      });

      describe('when the selected queue changes', function(){
        beforeEach(function(){
          $scope.model.input.scheduleMode = 'original';
          target.internal.onSelectedQueueChanged(1, 2);
          $scope.$apply();
        });

        it('should update the estimated live date', function(){
          expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
        });

        it('should change the schedule mode to queued', function(){
          expect($scope.model.input.scheduleMode).toBe(scheduleModes.queued);
        });
      });
    });

    describe('when updateContentFromPost is called', function(){
      beforeEach(function(){
        $scope.model.input = {};
      });

      it('should update the content', function(){
        $scope.model.input.content = 'blah';
        var post = {
          content: 'content',
          files: [
            {
              information: {
                fileId: 'fileId1',
                containerName: 'containerName1'
              },
              source: {
                renderSize: 'renderSize1',
                fileName: 'fn1',
                fileExtension: 'ex1',
                size: 'size1'
              }
            },
            {
              information: {
                fileId: 'fileId2',
                containerName: 'containerName2'
              },
              source: {
                renderSize: 'renderSize2',
                fileName: 'fn2',
                fileExtension: 'ex2',
                size: 'size2'
              }
            }
          ]
        };

        target.internal.updateContentFromPost(post);

        expect($scope.model.input.content).toEqual({
          serializedBlocks: 'content',
          files: [
            {
              fileId: 'fileId1',
              containerName: 'containerName1',
              renderSize: 'renderSize1',
              fileName: 'fn1.ex1',
              fileSize: 'size1'
            },
            {
              fileId: 'fileId2',
              containerName: 'containerName2',
              renderSize: 'renderSize2',
              fileName: 'fn2.ex2',
              fileSize: 'size2'
            }
          ]
        });
      });
    });

    describe('when initialize is called', function(){
      var deferredGetQueues;
      var deferredGetFullPost;
      var deferredUpdateEstimatedLiveDate;
      var model;
      beforeEach(function(){
        spyOn($scope, '$watch').and.callThrough();

        model = {input: {}};
        spyOn(target.internal, 'createModelFromPost').and.returnValue(model);
        spyOn(target.internal, 'watchForBusyBlocks');
        spyOn(target.internal, 'updateContentFromPost');

        deferredGetFullPost = $q.defer();
        postEditDialogUtilities.getFullPost.and.returnValue(deferredGetFullPost.promise);

        deferredGetQueues = $q.defer();
        blogRepository.getQueuesSorted.and.returnValue(deferredGetQueues.promise);

        deferredUpdateEstimatedLiveDate = $q.defer();
        composeUtilities.updateEstimatedLiveDate.and.returnValue(deferredUpdateEstimatedLiveDate.promise);

        target.initialize();
        $scope.$apply();
      });

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should set postId', function(){
        expect(target.internal.postId).toBe(postId);
      });

      it('should call getFullPost', function(){
        expect(postEditDialogUtilities.getFullPost).toHaveBeenCalledWith(
          initialPost, accountSettingsRepository, blogRepository, subscriptionRepository);
      });

      describe('when getFullPost succeeds', function(){
        beforeEach(function(){
          deferredGetFullPost.resolve(post);
          $scope.$apply();
        });

        it('should call createModelFromPost', function(){
          expect(target.internal.createModelFromPost).toHaveBeenCalledWith(post);
        });

        it('should watch for changes on the input date', function(){
          expect($scope.$watch).toHaveBeenCalledWith('model.input.date', target.internal.onInputDateChanged);
        });

        it('should call watchForBusyBlocks', function(){
          expect(target.internal.watchForBusyBlocks).toHaveBeenCalledWith();
        });

        it('should update the content from the post', function(){
          expect(target.internal.updateContentFromPost).toHaveBeenCalledWith(post);
        });

        it('should load call getQueuesSorted', function(){
          expect(blogRepository.getQueuesSorted).toHaveBeenCalledWith();
        });

        describe('when getQueuesSorted succeeds with no queues', function(){
          beforeEach(function(){
            deferredGetQueues.resolve([]);
            $scope.$apply();
          });

          it('should not set the selected queue', function(){
            expect($scope.model.input.selectedQueue).toBeUndefined();
          });

          it('should not watch for changes on the selected queue', function(){
            expect($scope.$watch.calls.count()).toBe(1);
          });

          it('should not update the estimated live date', function(){
            expect(composeUtilities.updateEstimatedLiveDate).not.toHaveBeenCalled();
          });
        });

        describe('when getQueuesSorted succeeds', function(){
          beforeEach(function(){
            deferredGetQueues.resolve([{ queueId: 'a' }, { queueId: 'b' }]);
            $scope.$apply();
          });

          it('should set the selected queue', function(){
            if(post.queueId){
              expect($scope.model.input.selectedQueue).toBe($scope.model.queues[1]);
            }
            else{
              expect($scope.model.input.selectedQueue).toBe($scope.model.queues[0]);
            }
          });

          it('should watch for changes on the selected queue', function(){
            expect($scope.$watch).toHaveBeenCalledWith('model.input.selectedQueue', target.internal.onSelectedQueueChanged);
          });

          it('should update the estimated live date', function(){
            expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
          });

          describe('when update estimated live date succeeds', function(){
            beforeEach(function(){
              deferredUpdateEstimatedLiveDate.resolve();
              $scope.$apply();
            });

            it('should set showContent to true', function(){
              expect($scope.model.showContent).toBe(true);
            });

            it('should set isLoading to false', function(){
              expect($scope.model.isLoading).toBe(false);
            });
          });

          describe('when update estimated live date fails', function(){
            beforeEach(function(){
              deferredUpdateEstimatedLiveDate.reject('error');
              $scope.$apply();
            });

            it('should set the error message', function(){
              expect($scope.model.errorMessage).toBe('friendlyError');
            });

            it('should set isLoading to false', function(){
              expect($scope.model.isLoading).toBe(false);
            });
          });
        });
      });

      describe('when getFullPost fails', function(){
        beforeEach(function(){
          deferredGetFullPost.reject('error');
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });
      });
    });
  });
});
