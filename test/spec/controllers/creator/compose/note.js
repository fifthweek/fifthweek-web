describe('compose note controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var postUtilities;
  var postsStub;
  var logService;
  var utilities;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['forceReload']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['getChannelsForSelection']);
    postsStub = jasmine.createSpyObj('postsStub', ['postNote']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('postUtilities', postUtilities);
      $provide.value('postsStub', postsStub);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composeNoteCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){

    describe('when initializing the model', function(){
      beforeEach(function(){
        postUtilities.getChannelsForSelection.and.returnValue($q.when([]));
        createController();
      });

      it('should set isSubmitted to false', function(){
        expect($scope.model.isSubmitted).toBe(false);
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
      });

      it('should set the error message to undefined', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should set the inputs to empty', function(){
        expect($scope.model.input.note).toBe('');
        expect($scope.model.input.date).toBe('');
      });
    });

    describe('when getChannelsForSelection succeeds', function(){
      var channels;

      beforeEach(function(){
        channels = [{name: 'a'}, {name: 'b'}];
        postUtilities.getChannelsForSelection.and.returnValue($q.when(channels));
        createController();
        $scope.$apply();
      });

      it('should populate the channels in the model', function(){
        expect($scope.model.channels).toEqual(channels);
      });

      it('should select the first channel', function(){
        expect($scope.model.input.selectedChannel).toEqual(channels[0]);
      });
    });

    describe('when getChannelsForSelection fails', function(){
      beforeEach(function(){
        postUtilities.getChannelsForSelection.and.returnValue($q.reject('error'));
        utilities.getFriendlyErrorMessage.and.returnValue('friendly');
        createController();
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(logService.error).toHaveBeenCalledWith('error');
      });

      it('should display a friendly error message', function(){
        expect($scope.model.errorMessage).toBe('friendly');
      });
    });
  });

  describe('when created', function(){
    var channels;

    beforeEach(function(){
      channels = [{name: 'a', channelId: '1'}, {name: 'b', channelId: 2}];
      postUtilities.getChannelsForSelection.and.returnValue($q.when(channels));
      createController();
      $scope.$apply();

      $scope.model.input.note = 'note';
      $scope.model.input.date = 'date';
    });

    describe('when calling postNow', function(){
      describe('when postNote succeeds', function(){
        beforeEach(function(){
          postsStub.postNote.and.returnValue($q.when());
          $scope.postNow();
          $scope.$apply();
        });

        it('should send the data without any date', function(){
          expect(postsStub.postNote.calls.count()).toBe(1);
          expect(postsStub.postNote).toHaveBeenCalledWith({
            channelId: '1',
            note: 'note'
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
      });

      describe('when postNote fails', function(){
        var error;
        beforeEach(function(){
          postsStub.postNote.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling postToBacklog', function(){
      describe('when postNote succeeds', function(){
        beforeEach(function(){
          postsStub.postNote.and.returnValue($q.when());
          $scope.postToBacklog();
          $scope.$apply();
        });

        it('should send the data with a date', function(){
          expect(postsStub.postNote.calls.count()).toBe(1);
          expect(postsStub.postNote).toHaveBeenCalledWith({
            channelId: '1',
            note: 'note',
            scheduledPostTime: 'date'
          });
        });

        it('should set submissionSucceeded to true', function(){
          expect($scope.model.submissionSucceeded).toBe(true);
        })
      });

      describe('when postNote fails', function(){
        var error;
        beforeEach(function(){
          postsStub.postNote.and.returnValue($q.reject('error'));
          $scope.postNow().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when postLater is called', function(){
      beforeEach(function(){
        $scope.postLater();
      });

      it('should set postLater to true', function(){
        expect($scope.model.postLater).toBe(true);
      });
    });

    describe('when cancelPostLater is called', function(){
      beforeEach(function(){
        $scope.cancelPostLater();
      });

      it('should set postLater to false', function(){
        expect($scope.model.postLater).toBe(false);
      });
    });

    describe('when postAnother is called', function(){
      beforeEach(function(){
        $scope.postAnother();
      });

      it('should set postLater to false', function(){
        expect($state.forceReload).toHaveBeenCalled();
      });
    });
  });
});
