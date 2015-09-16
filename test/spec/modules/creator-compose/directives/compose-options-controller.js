describe('compose options controller', function () {
  'use strict';

  var $scope;
  var $modal;
  var target;

  beforeEach(function() {
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');
    module(function($provide) {
      $provide.value('$modal', $modal);
    });

    inject(function ($injector, $controller) {
      $scope = $injector.get('$rootScope').$new();
      target = $controller('composeOptionsCtrl', { $scope: $scope });
    });
  });

  it('should display the "New Post" modal when requested', function() {
    $scope.newPost();

    expect($modal.open).toHaveBeenCalledWith({
      controller: 'composePostCtrl',
      templateUrl: 'modules/creator-compose/compose-post.html'
    });
  });
});
