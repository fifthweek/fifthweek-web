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

  it('should display the "New Image" modal when requested', function() {
    $scope.newImage();

    expect($modal.open).toHaveBeenCalledWith({
      controller: 'composeImageCtrl',
      templateUrl: 'modules/creator-compose/compose-upload.html'
    });
  });

  it('should display the "New File" modal when requested', function() {
    $scope.newFile();

    expect($modal.open).toHaveBeenCalledWith({
      controller: 'composeFileCtrl',
      templateUrl: 'modules/creator-compose/compose-upload.html'
    });
  });

  it('should display the "New Announcement" modal when requested', function() {
    $scope.newAnnouncement();

    expect($modal.open).toHaveBeenCalledWith({
      controller: 'composeNoteCtrl',
      templateUrl: 'modules/creator-compose/compose-note.html'
    });
  });
});
