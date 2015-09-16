describe('creator - create blog controller', function () {
  'use strict';

  var nextState = 'nextState';
  var error = 'error';

  var $q;

  var $scope;
  var $state;
  var calculatedStates;
  var blogService;
  var target;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);
    blogService = jasmine.createSpyObj('blogService', ['createFirstBlog']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('blogService', blogService);
    });

    inject(function ($injector, $controller) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      target = $controller('createBlogCtrl', { $scope: $scope });
    });

    blogService.createFirstBlog.and.returnValue($q.when());
  });

  it('should initialize with appropriate default state', function() {
    expect($scope.newBlogData.name).toBe('');
    expect($scope.newBlogData.basePrice).toBe('1.00');
  });

  it('should create first blog', function() {
    var name = 'name';
    var basePrice = '2.59';
    $scope.newBlogData.name = name;
    $scope.newBlogData.basePrice = basePrice;

    $scope.continue();
    $scope.$apply();

    expect(blogService.createFirstBlog).toHaveBeenCalledWith({
      name: name,
      basePrice: 259
    });
  });

  describe('when service call fails', function() {

    it('should not redirect', function() {
      blogService.createFirstBlog.and.returnValue($q.reject(error));

      $scope.continue();
      $scope.$apply();

      expect($state.go).not.toHaveBeenCalled();
    });
  });

  describe('when service call succeeds', function() {

    it('should redirect to new initial state', function() {
      calculatedStates.getDefaultState.and.returnValue(nextState);

      $scope.continue();
      $scope.$apply();

      expect($state.go).toHaveBeenCalledWith(nextState);
    });
  });
});
