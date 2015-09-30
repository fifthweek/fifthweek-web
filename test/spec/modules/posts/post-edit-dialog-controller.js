describe('post-edit-dialog-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var postEditDialogConstants;
  var scheduleModes;

  var post;
  var composeUtilities;
  var blobImageControlFactory;
  var postEditDialogUtilities;
  var errorFacade;
  var initializer;
  var blogRepositoryFactory;
  var blogRepository;

  var liveDateString;
  var roundedDateString;

  beforeEach(function () {

    liveDateString = '2015-06-01T05:05:05Z';
    roundedDateString = '2015-06-01T05:05:00Z';
    post = {
      postId: 'postId',
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
    postEditDialogUtilities = jasmine.createSpyObj('postEditDialogUtilities', ['getFileInformation', 'performSave', 'applyChangesToPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getQueuesSorted']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);

    module('webApp');
    module(function ($provide) {
      $provide.value('post', post);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('postEditDialogUtilities', postEditDialogUtilities);
      $provide.value('errorFacade', errorFacade);
      $provide.value('initializer', initializer);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
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

    var expectedScheduleMode;

    beforeEach(function(){
      spyOn(_, 'cloneDeep').and.callThrough();
      spyOn($scope, '$watch').and.callThrough();

      blobImageControlFactory.createControl.and.returnValue(jasmine.createSpyObj('blobImage', ['update']));
    });

    var runCreatingExpectations = function(){

      it('should clone the post', function(){
        expect(_.cloneDeep).toHaveBeenCalledWith(post);
      });

      it('should initialize the model', function(){
        expect($scope.model).toEqual({
          savedScheduleMode: expectedScheduleMode,
          savedDate: new Date(liveDateString),
          queuedLiveDate: undefined,
          channelId: 'b',
          processingImage: false,
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

      it('should get the blob repository', function(){
        expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
      });

      it('should assign scheduleModes to scope', function(){
        expect($scope.scheduleModes).toEqual(scheduleModes);
      });

      it('should assign the blob image control to the scope', function(){
        expect(blobImageControlFactory.createControl).toHaveBeenCalled();
        expect($scope.blobImage).toBeDefined();
      });

      it('should create an onImageUploadComplete function', function(){
        expect($scope.onImageUploadComplete).toBeDefined();
      });

      it('should create an onFileImageUploadComplete function', function(){
        expect($scope.onFileUploadComplete).toBeDefined();
      });

      it('should create a save function', function(){
        expect($scope.save).toBeDefined();
      });

      it('should call initializer with the initialize function', function(){
        expect(initializer.initialize).toHaveBeenCalledWith(target.initialize);
      });

      describe('when initialize is called', function(){
        var deferredGetQueues;
        beforeEach(function(){
          deferredGetQueues = $q.defer();
          blogRepository.getQueuesSorted.and.returnValue(deferredGetQueues.promise);

          target.initialize();
          $scope.$apply();
        });

        it('should watch for changes on the input date', function(){
          expect($scope.$watch).toHaveBeenCalledWith('model.input.date', jasmine.any(Function));
          expect($scope.$watch.calls.count()).toBe(1);
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
            expect($scope.$watch).toHaveBeenCalledWith('model.input.selectedQueue', jasmine.any(Function));
            expect($scope.$watch.calls.count()).toBe(2);
          });

          it('should update the estimated live date', function(){
            expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
            expect(composeUtilities.updateEstimatedLiveDate.calls.count()).toBe(1);
          });

          describe('when calling onImageUploadComplete', function(){
            var data;
            beforeEach(function(){
              postEditDialogUtilities.getFileInformation.and.returnValue({
                file: 'newImage',
                fileSource: 'newImageSource'
              });

              data = {
                fileId: 'newFileId',
                containerName: 'newContainerName'
              };

              $scope.onImageUploadComplete(data);
            });

            it('should call getFileInformation', function(){
              expect(postEditDialogUtilities.getFileInformation).toHaveBeenCalledWith(data);
            });

            it('should update the image model', function(){
              expect($scope.model.input.image).toBe('newImage');
              expect($scope.model.input.imageSource).toBe('newImageSource');
            });

            it('should set processingImage to true', function(){
              expect($scope.model.processingImage).toBe(true);
            });

            it('should update the blob image', function(){
              expect($scope.blobImage.update).toHaveBeenCalledWith('newContainerName', 'newFileId', false, target.internal.onBlobImageUpdateComplete);
            });
          });

          describe('when calling internal.onBlobImageUpdateComplete', function(){
            beforeEach(function(){
              $scope.model.processingImage = true;
              $scope.model.input.imageSource = {};

              target.internal.onBlobImageUpdateComplete({ renderSize: 'renderSize' });
            });

            it('should assign the renderSize to the model', function(){
              expect($scope.model.input.imageSource.renderSize).toBe('renderSize');
            });

            it('should set processingImage to false', function(){
              expect($scope.model.processingImage).toBe(false);
            });
          });

          describe('when calling onFileUploadComplete', function(){
            var data;
            beforeEach(function(){
              postEditDialogUtilities.getFileInformation.and.returnValue({
                file: 'newFile',
                fileSource: 'newFileSource'
              });

              data = {
                fileId: 'newFileId',
                containerName: 'newContainerName'
              };

              $scope.onFileUploadComplete(data);
            });

            it('should call getFileInformation', function(){
              expect(postEditDialogUtilities.getFileInformation).toHaveBeenCalledWith(data);
            });

            it('should update the file model', function(){
              expect($scope.model.input.file).toBe('newFile');
              expect($scope.model.input.fileSource).toBe('newFileSource');
            });
          });

          describe('when the input date is set', function(){
            describe('when the dates have not changed', function(){
              var originalScheduleMode;
              beforeEach(function(){
                originalScheduleMode = $scope.model.input.scheduleMode;
                $scope.model.input.date = new Date(roundedDateString);
                $scope.$apply();
              });

              it('should not change the schedule mode', function(){
                expect($scope.model.input.scheduleMode).toBe(originalScheduleMode);
              });
            });

            describe('when the dates have changed', function(){
              var originalScheduleMode;
              beforeEach(function(){
                originalScheduleMode = $scope.model.input.scheduleMode;
                $scope.model.input.date = new Date(liveDateString);
                $scope.$apply();
              });

              it('should change the schedule mode to scheduled', function(){
                expect($scope.model.input.scheduleMode).toBe(scheduleModes.scheduled);
              });
            });
          });

          describe('when the selected queue changes', function(){
            beforeEach(function(){
              $scope.model.input.selectedQueue = '2';
              $scope.$apply();
            });

            it('should update the estimated live date', function(){
              expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
              expect(composeUtilities.updateEstimatedLiveDate.calls.count()).toBe(2);
            });

            it('should change the schedule mode to queued', function(){
              expect($scope.model.input.scheduleMode).toBe(scheduleModes.queued);
            });
          });

          describe('when save is called', function(){
            beforeEach(function(){
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
                expect(postEditDialogUtilities.applyChangesToPost).toHaveBeenCalledWith(post, $scope.model);
              });

              it('should close the dialog passing the updated post', function(){
                expect($scope.$close).toHaveBeenCalled();
                expect($scope.$close.calls.count()).toBe(1);
                expect($scope.$close.calls.first().args[0]).toEqual(post);
                expect($scope.$close.calls.first().args[0]).not.toBe(post);
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
                expect(postEditDialogUtilities.applyChangesToPost).toHaveBeenCalledWith(post, $scope.model);
              });

              it('should not close the dialog', function(){
                expect($scope.$close).not.toHaveBeenCalled();
              });

              it('should return the error', function(){
                expect(error).toBe('error');
              });
            });
          });
        });
      });
    };

    describe('when scheduled now', function(){
      beforeEach(function(){
        expectedScheduleMode = scheduleModes.now;
        post.isScheduled = false;
        createController();
      });
      runCreatingExpectations();
    });
    describe('when scheduled queue', function(){
      beforeEach(function(){
        expectedScheduleMode = scheduleModes.queued;
        post.isScheduled = true;
        post.queueId = 'b';
        createController();
      });
      runCreatingExpectations();
    });
    describe('when scheduled date', function(){
      beforeEach(function(){
        expectedScheduleMode = scheduleModes.scheduled;
        post.isScheduled = true;
        post.queueId = undefined;
        createController();
      });
      runCreatingExpectations();
    });
  });
});
