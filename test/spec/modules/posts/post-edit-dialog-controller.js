describe('post-edit-dialog-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var postEditDialogConstants;
  var postTypes;
  var scheduleModes;

  var post;
  var composeUtilities;
  var blobImageControlFactory;
  var postEditDialogUtilities;
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
      channel: {
        channelId: 'b'
      },
      collection: {
        collectionId: 'b'
      }
    };
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['loadChannelsAndCollectionsIntoModel', 'updateEstimatedLiveDate']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    postEditDialogUtilities = jasmine.createSpyObj('postEditDialogUtilities', ['getFileInformation', 'performSave', 'applyChangesToPost']);

    module('webApp');
    module(function ($provide) {
      $provide.value('post', post);
      $provide.value('composeUtilities', composeUtilities);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('postEditDialogUtilities', postEditDialogUtilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      postEditDialogConstants = $injector.get('postEditDialogConstants');
      postTypes = postEditDialogConstants.postTypes;
      scheduleModes = postEditDialogConstants.scheduleModes;
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('postEditDialogCtrl', {$scope: $scope});
    });
  };


  describe('when creating', function(){

    var expectedPostType;
    var expectedScheduleMode;
    var loadDeferred;

    beforeEach(function(){
      spyOn(_, 'cloneDeep').and.callThrough();
      spyOn($scope, '$watch').and.callThrough();

      blobImageControlFactory.createControl.and.returnValue(jasmine.createSpyObj('blobImage', ['update']));
      postEditDialogUtilities.getFileInformation.and.returnValue({
        file: 'newFile',
        fileSource: 'newFileSource'
      });

      loadDeferred = $q.defer();
      composeUtilities.loadChannelsAndCollectionsIntoModel.and.returnValue(loadDeferred.promise);
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
          input: {
            comment: 'comment',
            image: expectedPostType === postTypes.image ? 'image' : undefined,
            imageSource: expectedPostType === postTypes.image ? 'imageSource' : undefined,
            file: expectedPostType === postTypes.file ? 'file' : undefined,
            fileSource: expectedPostType === postTypes.file ? 'fileSource' : undefined,
            date: new Date(roundedDateString),
            scheduleMode: expectedScheduleMode
          },
          postType: expectedPostType
        });
      });

      it('should assign postTypes to scope', function(){
        expect($scope.postTypes).toEqual(postTypes);
      });

      it('should assign scheduleModes to scope', function(){
        expect($scope.scheduleModes).toEqual(scheduleModes);
      });

      it('should assign the blob image control to the scope', function(){
        expect(blobImageControlFactory.createControl).toHaveBeenCalled();
        expect($scope.blobImage).toBeDefined();
      });

      it('should watch for changes on the input date', function(){
        expect($scope.$watch).toHaveBeenCalledWith('model.input.date', jasmine.any(Function));
      });

      it('should load channels and collections into the model', function(){
        expect(composeUtilities.loadChannelsAndCollectionsIntoModel).toHaveBeenCalledWith($scope.model);
      });

      it('should create an onUploadComplete function', function(){
        expect($scope.onUploadComplete).toBeDefined();
      });

      it('should create a save function', function(){
        expect($scope.save).toBeDefined();
      });

      describe('when channels and collections are loaded', function(){
        beforeEach(function(){
          $scope.model.channels = [{ channelId: 'a' }, { channelId: 'b' }];
          $scope.model.input.selectedChannel = $scope.model.channels[0];

          if(expectedPostType !== postTypes.note){
            $scope.model.collections = [{ collectionId: 'a' }, { collectionId: 'b' }];
            $scope.model.input.selectedCollection = $scope.model.collections[0];
          }

          loadDeferred.resolve();
          $scope.$apply();
        });

        it('should set the selected channel', function(){
          expect($scope.model.input.selectedChannel).toBe($scope.model.channels[1]);
        });

        it('should set the selected collection if not a note', function(){
          if(expectedPostType !== postTypes.note) {
            expect($scope.model.input.selectedCollection).toBe($scope.model.collections[1]);
          }
          else {
            expect($scope.model.input.selectedCollection).toBeUndefined();
          }
        });

        it('should watch for changes on the selected collection if not a note', function(){
          if(expectedPostType !== postTypes.note) {
            expect($scope.$watch).toHaveBeenCalledWith('model.input.selectedCollection', jasmine.any(Function));
          }
          else{
            expect($scope.$watch).not.toHaveBeenCalledWith('model.input.selectedCollection', jasmine.any(Function));
          }
        });

        it('should update the estimated live date', function(){
          if(expectedPostType !== postTypes.note) {
            expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
            expect(composeUtilities.updateEstimatedLiveDate.calls.count()).toBe(1);
          }
          else{
            expect(composeUtilities.updateEstimatedLiveDate).not.toHaveBeenCalled();
          }
        });

        describe('when calling onUploadComplete', function(){
          var data;
          beforeEach(function(){
            data = {
              fileId: 'newFileId',
              containerName: 'newContainerName'
            };
            $scope.onUploadComplete(data);
          });

          it('should call getFileInformation', function(){
            expect(postEditDialogUtilities.getFileInformation).toHaveBeenCalledWith(data);
          });

          it('should update the image model if an image', function(){
            if(expectedPostType === postTypes.image) {
              expect($scope.model.input.image).toBe('newFile');
              expect($scope.model.input.imageSource).toBe('newFileSource');
            }
            else{
              expect($scope.model.input.image).toBeUndefined();
              expect($scope.model.input.imageSource).toBeUndefined();
            }
          });

          it('should update the file model if a file', function(){
            if(expectedPostType === postTypes.file) {
              expect($scope.model.input.file).toBe('newFile');
              expect($scope.model.input.fileSource).toBe('newFileSource');
            }
            else{
              expect($scope.model.input.file).toBeUndefined();
              expect($scope.model.input.fileSource).toBeUndefined();
            }
          });

          it('should update the blob image if post is an image', function(){
            if(expectedPostType === postTypes.image){
              expect($scope.blobImage.update).toHaveBeenCalledWith('newContainerName', 'newFileId')
            }
            else{
              expect($scope.blobImage.update).not.toHaveBeenCalledWith()
            }
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
            })
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
            })
          });
        });

        describe('when the selected collection changes', function(){
          beforeEach(function(){
            $scope.model.input.selectedCollection = '2';
            $scope.$apply();
          });

          it('should update the estimated live date if not a note', function(){
            if(expectedPostType != postTypes.note){
              expect(composeUtilities.updateEstimatedLiveDate).toHaveBeenCalledWith($scope.model);
              expect(composeUtilities.updateEstimatedLiveDate.calls.count()).toBe(2);
            }
            else{
              expect(composeUtilities.updateEstimatedLiveDate).not.toHaveBeenCalled();
            }
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
    };

    describe('when post is a note', function(){
      beforeEach(function(){
        delete post.image;
        delete post.imageSource;
        delete post.file;
        delete post.fileSource;
        expectedPostType = postTypes.note;
      });
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
          post.scheduledByQueue = true;
          createController();
        });
        runCreatingExpectations();
      });
      describe('when scheduled date', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.scheduled;
          post.isScheduled = true;
          post.scheduledByQueue = false;
          createController();
        });
        runCreatingExpectations();
      });
    });

    describe('when post is a image', function(){
      beforeEach(function(){
        delete post.file;
        delete post.fileSource;
        expectedPostType = postTypes.image;
      });
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
          post.scheduledByQueue = true;
          createController();
        });
        runCreatingExpectations();
      });
      describe('when scheduled date', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.scheduled;
          post.isScheduled = true;
          post.scheduledByQueue = false;
          createController();
        });
        runCreatingExpectations();
      });
    });

    describe('when post is a file', function(){
      beforeEach(function(){
        delete post.image;
        delete post.imageSource;
        expectedPostType = postTypes.file;
      });
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
          post.scheduledByQueue = true;
          createController();
        });
        runCreatingExpectations();
      });
      describe('when scheduled date', function(){
        beforeEach(function(){
          expectedScheduleMode = scheduleModes.scheduled;
          post.isScheduled = true;
          post.scheduledByQueue = false;
          createController();
        });
        runCreatingExpectations();
      });
    });
  });
});
