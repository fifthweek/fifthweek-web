angular.module('webApp').controller(
  'customizeLandingPageCtrl',
  function($scope, $q, subscriptionRepositoryFactory, aggregateUserStateUtilities, subscriptionStub, errorFacade, blobImageControlFactory) {
    'use strict';

    var model = {
      settings: undefined,
      errorMessage: undefined,
      landingPageUrl: undefined
    };

    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var loadForm = function(){

      return subscriptionRepository.getSubscription()
        .then(function(data){
          model.settings = data;

          model.landingPageUrl = 'https://www.fifthweek.com/' + aggregateUserStateUtilities.getUsername();

          if(data.headerImage){
            $scope.blobImage.update(data.headerImage.containerName, data.headerImage.fileId, true);
          }
          else{
            $scope.blobImage.update();
          }
        })
        .catch(function(error){
          model.settings = undefined;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    $scope.blobImage = blobImageControlFactory.createControl();
    $scope.model = model;

    loadForm();

    $scope.onUploadComplete = function(data) {
      model.settings.headerImage = data;
      $scope.form.$setDirty();
      $scope.blobImage.update(data.containerName, data.fileId, false);
    };

    $scope.submitForm = function() {
      var fileId;
      if(model.settings.headerImage){
        fileId = model.settings.headerImage.fileId;
      }
      var subscriptionData = {
        subscriptionName: model.settings.subscriptionName,
        tagline: model.settings.tagline,
        introduction: model.settings.introduction,
        headerImageFileId: fileId,
        video: model.settings.video ? model.settings.video : undefined,
        description: model.settings.description
      };

      return subscriptionStub.putSubscription(model.settings.subscriptionId, subscriptionData)
        .then(function() {
          return subscriptionRepository.setSubscription(model.settings);
        })
        .then(function(){
          $scope.form.$setPristine();
        });
    };

});
