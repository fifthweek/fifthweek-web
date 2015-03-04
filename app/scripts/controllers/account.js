angular.module('webApp')
  .controller('AccountCtrl', function ($scope, $q, authenticationService, accountSettingsStub, logService, utilities, blobImageControlFactory) {
    'use strict';

    var model = {
      accountSettings: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var loadForm = function(){
      model.errorMessage = undefined;
      model.isLoading = true;
      var username = authenticationService.currentUser.username;
      var userId = authenticationService.currentUser.userId;
      return accountSettingsStub.get(userId)
        .then(function(result){
          var data = result.data;
          model.accountSettings = {};
          model.accountSettings.email = data.email;
          model.accountSettings.username = username;
          model.accountSettings.userId = userId;

          if(data.profileImage){
            model.accountSettings.profileImageId = data.profileImage.fileId;
            $scope.blobImage.update(data.profileImage.uri, data.profileImage.containerName, true);
          }
          else{
            model.accountSettings.profileImageId = undefined;
            $scope.blobImage.update();
          }
        })
        .catch(function(error){
          logService.error(error);
          model.errorMessage = utilities.getFriendlyErrorMessage(error);
          model.accountSettings = undefined;
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    $scope.blobImage = blobImageControlFactory.createControl();
    $scope.model = model;

    loadForm();

    $scope.onUploadComplete = function(data) {
      model.accountSettings.profileImageId = data.fileId;
      $scope.form.$setDirty();
      $scope.blobImage.update(data.fileUri, data.containerName, false);
    };

    $scope.submitForm = function() {
      return accountSettingsStub
        .put(model.accountSettings.userId, {
          newEmail: model.accountSettings.email,
          newUsername: model.accountSettings.username,
          newPassword: model.password ? model.password : undefined,
          newProfileImageId: model.accountSettings.profileImageId
        })
        .then(function(){
          $scope.form.$setPristine();
          authenticationService.updateUsername(model.accountSettings.userId, model.accountSettings.username);
        });
    };
  });
