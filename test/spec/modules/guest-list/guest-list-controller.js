describe('guest-list-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var initializer;
  var blogAccessStub;
  var blogService;
  var errorFacade;

  beforeEach(function () {
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogAccessStub = jasmine.createSpyObj('blogAccessStub', ['getFreeAccessList', 'putFreeAccessList']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    blogService = {blogId: undefined};

    module('webApp');
    module(function ($provide) {
      $provide.value('initializer', initializer);
      $provide.value('blogAccessStub', blogAccessStub);
      $provide.value('blogService', blogService);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    errorFacade.handleError.and.callFake(function (error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('guestListCtrl', {$scope: $scope});
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

    it('should set isEditing to false', function(){
      expect($scope.model.isEditing).toBe(false);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set freeAccessUsers to undefined', function(){
      expect($scope.model.freeAccessUsers).toBeUndefined();
    });

    it('should set invalidEmails to undefined', function(){
      expect($scope.model.invalidEmails).toBeUndefined();
    });

    it('should set registeredCount to zero', function(){
      expect($scope.model.registeredCount).toBe(0);
    });

    it('should set subscribedCount to zero', function(){
      expect($scope.model.registeredCount).toBe(0);
    });

    it('should set the input text to an empty string', function(){
      expect($scope.model.input.emailsText).toBe('');
    });

    it('should initialize by calling loadForm', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.loadForm);
    });
  });

  describe('when created', function(){
    beforeEach(function() {
      createController();
    });

    describe('when calling loadForm', function(){

      describe('when no blogId exists', function(){
        beforeEach(function(){
          blogService.blogId = undefined;
          spyOn(target.internal, 'refresh');
          target.internal.loadForm();
        });

        it('should display an error message', function(){
          expect($scope.model.errorMessage).toBe('You must create a blog before managing the guest list.');
        });

        it('should not call refresh', function(){
          expect(target.internal.refresh).not.toHaveBeenCalled();
        });
      });

      describe('when blogId exists', function(){
        beforeEach(function(){
          blogService.blogId = 'blogId';
          spyOn(target.internal, 'refresh');
          target.internal.loadForm();
        });

        it('should not display an error message', function(){
          expect($scope.model.errorMessage).toBeUndefined();
        });

        it('should set the blog id', function(){
          expect($scope.model.blogId).toBe('blogId');
        });

        it('should call refresh', function(){
          expect(target.internal.refresh).toHaveBeenCalled();
        });
      });
    });

    describe('when refresh is called', function(){
      var deferred;
      beforeEach(function(){
        $scope.model.blogId = 'blogId';
        $scope.model.errorMessage = 'error';
        $scope.model.isLoading = false;

        deferred = $q.defer();
        blogAccessStub.getFreeAccessList.and.returnValue(deferred.promise);
        spyOn(target.internal, 'processResult');
        target.internal.refresh();
      });

      it('should set errorMessage to undefined', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should call getFreeAccessList', function(){
        expect(blogAccessStub.getFreeAccessList).toHaveBeenCalledWith('blogId');
      });

      describe('when getFreeAccessList returns with data', function(){
        beforeEach(function(){
          deferred.resolve({ data: { freeAccessUsers: 'freeAccessUsers' } });
          $scope.$apply();
        });

        it('should call processResult', function(){
          expect(target.internal.processResult).toHaveBeenCalledWith('freeAccessUsers');
        });

        it('should not error', function(){
          expect(errorFacade.handleError).not.toHaveBeenCalled();
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });
      });

      describe('when getFreeAccessList returns with an error', function(){
        beforeEach(function(){
          deferred.reject('error');
          $scope.$apply();
        });

        it('should not call processResult', function(){
          expect(target.internal.processResult).not.toHaveBeenCalled();
        });

        it('should log the error', function(){
          expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });
      });
    });

    describe('when processResult is called', function(){
      describe('when freeAccessUsers is undefined', function(){
        beforeEach(function(){
          $scope.model.freeAccessUsers = {};
          $scope.model.registeredCount = 10;
          $scope.model.subscribedCount = 10;
          $scope.model.input.emailsText = 'something';
          target.internal.processResult(undefined);
        });

        it('should set freeAccessUsers to undefined', function(){
          expect($scope.model.freeAccessUsers).toBeUndefined();
        });

        it('should set registeredCount to 0', function(){
          expect($scope.model.registeredCount).toBe(0);
        });

        it('should set subscribedCount to 0', function(){
          expect($scope.model.subscribedCount).toBe(0);
        });

        it('should set the emailsText to empty', function(){
          expect($scope.model.input.emailsText).toBe('');
        });
      });

      describe('when freeAccessUsers is an empty list', function(){
        beforeEach(function(){
          $scope.model.freeAccessUsers = {};
          $scope.model.registeredCount = 10;
          $scope.model.subscribedCount = 10;
          $scope.model.input.emailsText = 'something';
          target.internal.processResult([]);
        });

        it('should set freeAccessUsers to undefined', function(){
          expect($scope.model.freeAccessUsers).toBeUndefined();
        });

        it('should set registeredCount to 0', function(){
          expect($scope.model.registeredCount).toBe(0);
        });

        it('should set subscribedCount to 0', function(){
          expect($scope.model.subscribedCount).toBe(0);
        });

        it('should set the emailsText to empty', function(){
          expect($scope.model.input.emailsText).toBe('');
        });
      });

      describe('when freeAccessUsers contains data', function(){
        var freeAccessUsers;
        beforeEach(function(){
          freeAccessUsers = [
            {
              email: 'email1',
              username: 'username1',
              channelIds: ['channelId1', 'channelId2']
            },
            {
              email: 'email2',
              username: 'username2',
              channelIds: []
            },
            {
              email: 'email3',
              username: undefined,
              channelIds: undefined
            }
          ];

          target.internal.processResult(freeAccessUsers);
        });

        it('should set freeAccessUsers with added isSubscribed field', function(){
          var expectedFreeAccessUsers = _.cloneDeep(freeAccessUsers);
          expectedFreeAccessUsers[0].isSubscribed = true;
          expectedFreeAccessUsers[1].isSubscribed = false;
          expectedFreeAccessUsers[2].isSubscribed = false;
          expect($scope.model.freeAccessUsers).toEqual(expectedFreeAccessUsers);
        });

        it('should set emailsText', function(){
          expect($scope.model.input.emailsText).toBe('email1\nemail2\nemail3');
        });

        it('should set registeredCount', function(){
          expect($scope.model.registeredCount).toBe(2);
        });

        it('should set subscribedCount', function(){
          expect($scope.model.subscribedCount).toBe(1);
        });
      });
    });

    describe('when save is called', function(){
      var deferred;
      var error;
      beforeEach(function(){
        deferred = $q.defer();
        spyOn(target.internal, 'refresh');
        blogAccessStub.putFreeAccessList.and.returnValue(deferred.promise);
        $scope.model.blogId = 'blogId';

        $scope.model.input.emailsText = 'email1\nemail2\nemail3';
        $scope.model.isEditing = true;
        $scope.save().catch(function(e){ error = e; });
      });

      it('should call putFreeAccessList', function(){
        expect(blogAccessStub.putFreeAccessList).toHaveBeenCalledWith('blogId', { emails: ['email1', 'email2', 'email3'] });
      });

      describe('when putFreeAccessList returns invalid emails', function(){
        beforeEach(function(){
          deferred.resolve({
            data: {
              invalidEmailAddresses: 'invalidEmails'
            }
          });

          $scope.$apply();
        });

        it('should set the invalid emails into the model', function(){
          expect($scope.model.invalidEmails).toBe('invalidEmails');
        });

        it('should exit editing mode', function(){
          expect($scope.model.isEditing).toBe(false);
        });

        it('should refresh the guest list', function(){
          expect(target.internal.refresh).toHaveBeenCalled();
        });
      });

      describe('when putFreeAccessList returns an empty result', function(){
        beforeEach(function(){
          deferred.resolve({
            data: {}
          });

          $scope.model.invalidEmails = 'originalInvalidEmails';
          $scope.$apply();
        });

        it('should set the invalid emails to undefined', function(){
          expect($scope.model.invalidEmails).toBeUndefined();
        });

        it('should exit editing mode', function(){
          expect($scope.model.isEditing).toBe(false);
        });

        it('should refresh the guest list', function(){
          expect(target.internal.refresh).toHaveBeenCalled();
        });
      });

      describe('when putFreeAccessList returns an error', function(){
        beforeEach(function(){
          deferred.reject('error');
          $scope.$apply();
        });

        it('should return the error', function(){
          expect(error).toBe('error');
        });

        it('should not exit editing mode', function(){
          expect($scope.model.isEditing).toBe(true);
        });

        it('should not call refresh', function(){
          expect(target.internal.refresh).not.toHaveBeenCalled();
        });
      });
    });

    describe('when editList is called', function(){
      beforeEach(function(){
        $scope.model.errorMessage = 'error';
        $scope.model.isEditing = false;
        $scope.editList();
      });

      it('should clear the error message', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set isEditing to true', function(){
        expect($scope.model.isEditing).toBe(true);
      });
    });

    describe('when viewList is called', function(){
      beforeEach(function(){
        $scope.model.errorMessage = 'error';
        $scope.model.isEditing = true;
        $scope.viewList();
      });

      it('should clear the error message', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set isEditing to false', function(){
        expect($scope.model.isEditing).toBe(false);
      });
    });
  });
});
