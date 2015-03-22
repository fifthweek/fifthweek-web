describe('delete-link controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var deleteVerification;

  beforeEach(function() {
    deleteVerification = jasmine.createSpyObj('deleteVerification', ['verifyDelete']);

    module('webApp');
    module(function($provide) {
      $provide.value('deleteVerification', deleteVerification);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('deleteLinkCtrl', { $scope: $scope });
    });
  };

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    it('should add a verifyDelete function to the scope', function(){
      expect($scope.verifyDelete).toBeDefined();
    });

    describe('when calling verifyDelete', function(){
      beforeEach(function(){
        $scope.delete = 'delete';
        $scope.eventTitle = 'eventTitle';
        $scope.eventCategory = 'eventCategory';
        $scope.itemType = 'itemType';
        $scope.item = 'item';

        $scope.verifyDelete();
      });

      it('should forward the call to the deleteVerification service', function() {
        expect(deleteVerification.verifyDelete).toHaveBeenCalledWith(
          'delete',
          'eventTitle',
          'eventCategory',
          'itemType',
          'item');
      });
    });
  });
});
