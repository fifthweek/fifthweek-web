describe('information-header-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var authenticationService;
  var initializer;
  var aggregateUserStateConstants;

  beforeEach(function() {

    authenticationService = { currentUser: {} };
    initializer = jasmine.createSpyObj('initializer', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('initializer', initializer);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('informationHeaderCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should initialize', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('initialize', function(){
      beforeEach(function(){
        spyOn(target.internal, 'update');
        spyOn($scope, '$on');

        target.internal.initialize();
      });

      it('should attach to the aggregate user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.update);
      });

      it('should call update', function(){
        expect(target.internal.update).toHaveBeenCalledWith();
      });
    });

    describe('update', function(){
      it('should update isAuthenticated', function(){
        authenticationService.currentUser.authenticated = 'authenticated';
        target.internal.update();

        expect($scope.isAuthenticated).toBe('authenticated');
      });
    });
  });
});
