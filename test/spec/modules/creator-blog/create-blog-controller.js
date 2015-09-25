describe('creator - create blog controller', function () {
  'use strict';

  var error = 'error';

  var $q;

  var $scope;
  var $state;
  var blogService;
  var states;
  var target;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    blogService = jasmine.createSpyObj('blogService', ['createFirstBlog']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('blogService', blogService);
    });

    inject(function ($injector, $controller) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      target = $controller('createBlogCtrl', { $scope: $scope });
      states = $injector.get('states');
    });

    blogService.createFirstBlog.and.returnValue($q.when());
  });

  it('should initialize with appropriate default state', function() {
    expect($scope.newBlogData.name).toBe('');
    expect($scope.newBlogData.basePrice).toBe('0.50');
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
      $scope.continue();
      $scope.$apply();

      expect($state.go).toHaveBeenCalledWith(states.creator.posts.live.name);
    });
  });
});
