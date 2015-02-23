angular.module('webApp')
  .controller('AccountCtrl', function ($scope) {
    'use strict';

    $scope.accountSettingsData = {
      email:'',
      emailDefault:'marc@example.com',
      username:'',
      usernameDefault:'marc-holmes',
      photo:'',
      photoDefault:'images/avatar-default.png',
      password:''
    };

    /*$scope.submitForm = function() {

    };
    */


    $scope.blobImage = {};
    $scope.model = {};

    $scope.onUploadComplete = function(data) {
      $scope.model.newProfileImageId = data.fileUri;
      $scope.blobImage.update(data.fileUri, data.containerName);
    };

  });
