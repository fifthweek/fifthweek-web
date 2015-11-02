describe('post-dialog-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var post;
  var updateLikeStatus;
  var updateCommentsCount;

  beforeEach(function(){
    post = 'post';
    updateLikeStatus = jasmine.createSpy('updateLikeStatus');
    updateCommentsCount = jasmine.createSpy('updateCommentsCount');
  });

  var initialize = function(updateLikeStatus, updateCommentsCount) {
    module('webApp');
    module(function($provide) {
      $provide.value('post', post);
      $provide.value('updateLikeStatus', updateLikeStatus);
      $provide.value('updateCommentsCount', updateCommentsCount);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  };

  var createController = function(){
    inject(function ($controller) {
      target = $controller('postDialogCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      initialize(updateLikeStatus, updateCommentsCount);
      createController();
    });

    it('should set the post', function(){
      expect($scope.post).toBe('post');
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initialize(updateLikeStatus, updateCommentsCount);
      createController();
    });

    describe('updateLikeStatus', function(){
      it('should call delegate', function(){
        $scope.updateLikeStatus('likesCount', 'hasLiked');
        expect(updateLikeStatus).toHaveBeenCalledWith('likesCount', 'hasLiked');
      });
    });

    describe('updateCommentsCount', function(){
      it('should call delegate', function(){
        $scope.updateCommentsCount('totalComments');
        expect(updateCommentsCount).toHaveBeenCalledWith('totalComments');
      });
    });
  });

  describe('when created without delegates', function(){
    beforeEach(function(){
      initialize(undefined, undefined);
      createController();
    });

    describe('updateLikeStatus', function(){
      it('should not error', function(){
        $scope.updateLikeStatus('likesCount', 'hasLiked');
      });
    });

    describe('updateCommentsCount', function(){
      it('should not error', function(){
        $scope.updateCommentsCount('totalComments');
      });
    });
  });
});
