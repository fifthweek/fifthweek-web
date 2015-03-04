angular.module('webApp').controller(
  'customizeLandingPageCtrl',
  function($scope, $q, authenticationService, aggregateUserState, subscriptionStub, logService, utilities, blobImageControlFactory) {
    'use strict';

    var model = {
      settings: undefined,
      isLoading: false,
      errorMessage: undefined,
      landingPageUrl: 'https://www.fifthweek.com/' + authenticationService.currentUser.username
    };

    var loadForm = function(){
      if(!aggregateUserState.currentValue || !aggregateUserState.currentValue.creatorStatus)
      {
        model.errorMessage = 'Subscription ID unavailable.';
        return;
      }

      var subscriptionId = aggregateUserState.currentValue.creatorStatus.subscriptionId;
      if(!subscriptionId){
        model.errorMessage = 'You do not have a subscription to customize.';
        return;
      }

      model.errorMessage = undefined;
      model.isLoading = true;
      return subscriptionStub.getSubscription(subscriptionId)
        .then(function(result){
          var data = result.data;
          model.settings = _.cloneDeep(data);
          delete model.settings.headerImage;

          if(data.headerImage){
            model.settings.headerImageFileId = data.headerImage.fileId;
            $scope.blobImage.update(data.headerImage.uri, data.headerImage.containerName, true);
          }
          else{
            model.settings.headerImageFileId = undefined;
            $scope.blobImage.update();
          }
        })
        .catch(function(error){
          logService.error(error);
          model.errorMessage = utilities.getFriendlyErrorMessage(error);
          model.settings = undefined;
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    $scope.blobImage = blobImageControlFactory.createControl();
    $scope.model = model;

    loadForm();

    $scope.onUploadComplete = function(data) {
      model.settings.headerImageFileId = data.fileId;
      $scope.form.$setDirty();
      $scope.blobImage.update(data.fileUri, data.containerName, false);
    };

    $scope.submitForm = function() {
      var subscriptionData = {
        subscriptionName: model.settings.subscriptionName,
        tagline: model.settings.tagline,
        introduction: model.settings.introduction,
        headerImageFileId: model.settings.headerImageFileId,
        video: model.settings.video ? model.settings.video : undefined,
        description: model.settings.description
      };

      return subscriptionStub.putSubscription(model.settings.subscriptionId, subscriptionData)
        .then(function(){
          $scope.form.$setPristine();
        });
    };

});
