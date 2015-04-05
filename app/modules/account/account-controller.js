angular.module('webApp')
  .controller('AccountCtrl', function ($scope, $q, accountSettingsRepositoryFactory, accountSettingsStub, errorFacade, blobImageControlFactory) {
    'use strict';

    var model = {
      accountSettings: undefined,
      errorMessage: undefined
    };

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

    var loadForm = function(){
      return accountSettingsRepository.getAccountSettings()
        .then(function(data){
          model.accountSettings = data;

          if(data.profileImage){
            $scope.blobImage.update(data.profileImage.containerName, data.profileImage.fileId, true);
          }
          else{
            $scope.blobImage.update();
          }
        })
        .catch(function(error){
          model.accountSettings = undefined;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    $scope.blobImage = blobImageControlFactory.createControl();
    $scope.model = model;

    loadForm();

    $scope.onUploadComplete = function(data) {
      model.accountSettings.profileImage = data;
      $scope.form.$setDirty();
      $scope.blobImage.update(data.containerName, data.fileId, false);
    };

    $scope.submitForm = function() {
      var userId = accountSettingsRepository.getUserId();
      var fileId;
      if(model.accountSettings.profileImage){
        fileId = model.accountSettings.profileImage.fileId;
      }
      return accountSettingsStub
        .put(userId, {
          newEmail: model.accountSettings.email,
          newUsername: model.accountSettings.username,
          newPassword: model.password ? model.password : undefined,
          newProfileImageId: fileId
        })
        .then(function() {
          return accountSettingsRepository.setAccountSettings(model.accountSettings);
        })
        .then(function(){
          $scope.form.$setPristine();
        });
    };
  });
