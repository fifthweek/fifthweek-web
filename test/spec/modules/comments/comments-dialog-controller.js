describe('comments-dialog-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var initializer;
  var postStub;
  var errorFacade;

  var postId;
  var updateCommentsCount;

  beforeEach(function() {
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    postStub = jasmine.createSpyObj('postStub', ['postComment', 'getComments']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    postId = 'postId';
    updateCommentsCount = jasmine.createSpy('updateCommentsCount');

    module('webApp');
    module(function($provide) {
      $provide.value('initializer', initializer);
      $provide.value('postStub', postStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('postId', postId);
      $provide.value('updateCommentsCount', updateCommentsCount);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    $scope.commentOnPostForm = {
      $setPristine: jasmine.createSpy('setPristine')
    };

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('commentsDialogCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set isLoading to false', function(){
      expect($scope.model.isLoading).toBe(false);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set comments to empty', function(){
      expect($scope.model.comments).toEqual([]);
    });

    it('should set input comment to empty', function(){
      expect($scope.model.input.comment).toEqual('');
    });

    it('should initialize', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when initialize is called', function(){
      beforeEach(function(){
        spyOn(target.internal, 'loadForm');
        target.initialize();
      });

      it('should call loadForm', function(){
        expect(target.internal.loadForm).toHaveBeenCalledWith();
      });
    });

    describe('when saveComment is called', function(){
      var success;
      var error;
      var deferredPostComment;
      var deferredLoadForm;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredPostComment = $q.defer();
        postStub.postComment.and.returnValue(deferredPostComment.promise);

        deferredLoadForm = $q.defer();
        spyOn(target.internal, 'loadForm').and.returnValue(deferredLoadForm.promise);

        $scope.model.errorMessage = 'bad';
        $scope.model.input.comment = 'comment';
        $scope.saveComment().then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should clear the error message', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should call postComment', function(){
        expect(postStub.postComment).toHaveBeenCalledWith('postId', { content: 'comment' });
      });

      describe('when postComment succeeds', function(){
        beforeEach(function(){
          deferredPostComment.resolve();
          $scope.$apply();
        });

        it('should clear comment', function(){
          expect($scope.model.input.comment).toBe('');
        });

        it('should set the form to pristine', function(){
          expect($scope.commentOnPostForm.$setPristine).toHaveBeenCalled();
        });

        it('should call loadForm', function(){
          expect(target.internal.loadForm).toHaveBeenCalledWith();
        });

        describe('when loadForm succeeds', function(){
          beforeEach(function(){
            deferredLoadForm.resolve();
            $scope.$apply();
          });

          it('should not set the error message', function(){
            expect($scope.model.errorMessage).toBeUndefined();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });

        });

        describe('when loadForm fails', function(){
          beforeEach(function(){
            deferredLoadForm.reject('error');
            $scope.$apply();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when postComment fails', function(){
        beforeEach(function(){
          deferredPostComment.reject('error');
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when loadForm is called', function(){
      var success;
      var error;
      var deferredGetComments;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetComments = $q.defer();
        postStub.getComments.and.returnValue(deferredGetComments.promise);

        spyOn(target.internal, 'processComments');

        $scope.model.errorMessage = 'error';
        $scope.model.isLoading = false;

        target.internal.loadForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should set error message to undefined', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should call getComments', function(){
        expect(postStub.getComments).toHaveBeenCalledWith('postId');
      });

      describe('when getComments succeeds', function(){
        beforeEach(function(){
          deferredGetComments.resolve({ data: { comments: ['a', 'b'] } });
          $scope.$apply();
        });

        it('should call processComments', function(){
          expect(target.internal.processComments).toHaveBeenCalledWith(['a', 'b']);
        });

        it('should assign comments', function(){
          expect($scope.model.comments).toEqual(['a', 'b']);
        });

        it('should update comments count', function(){
          expect(updateCommentsCount).toHaveBeenCalledWith(2);
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when postComment fails', function(){
        beforeEach(function(){
          deferredGetComments.reject('error');
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when processComments is called', function(){
      var comments;
      beforeEach(function(){
        spyOn(window, 'moment').and.callFake(function(date){
          return {
            date: date,
            fromNow: function(){
              return 'fromNow';
            },
            isSame: function(previous){
              return date.getUTCDate() === previous.date.getUTCDate();
            }
          };
        });

        comments = [
          {
            name: 'a',
            creationDate: 'creationDate1'
          },
          {
            name: 'b',
            creationDate: 'creationDate2'
          },
          {
            name: 'c',
            creationDate: 'creationDate3'
          }
        ];

        target.internal.processComments(comments);
      });

      it('should reverse order', function(){
        expect(comments[0].name).toBe('c');
        expect(comments[1].name).toBe('b');
        expect(comments[2].name).toBe('a');
      });

      it('should set liveSince field', function(){
        expect(comments[0].liveSince).toBe('fromNow');
        expect(comments[1].liveSince).toBe('fromNow');
        expect(comments[2].liveSince).toBe('fromNow');
      });

      it('should set number field', function(){
        expect(comments[0].number).toBe(3);
        expect(comments[1].number).toBe(2);
        expect(comments[2].number).toBe(1);
      });
    });
  });
});
