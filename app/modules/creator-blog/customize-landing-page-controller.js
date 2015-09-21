angular.module('webApp').controller(
  'customizeLandingPageCtrl',
  function($scope, $q, $state, states, blogRepositoryFactory, aggregateUserStateUtilities, blogStub, errorFacade, blobImageControlFactory) {
    'use strict';

    var model = {
      settings: undefined,
      errorMessage: undefined,
      landingPageUrl: undefined
    };

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    var loadForm = function(){

      return blogRepository.getBlog()
        .then(function(data){
          model.settings = data;

          model.username = aggregateUserStateUtilities.getUsername();
          model.landingPageUrl = 'https://www.fifthweek.com/' + model.username;

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
      var blogData = {
        name: model.settings.name,
        introduction: model.settings.introduction,
        headerImageFileId: fileId,
        video: model.settings.video ? model.settings.video : undefined,
        description: model.settings.description
      };

      return blogStub.putBlog(model.settings.blogId, blogData)
        .then(function() {
          return blogRepository.setBlog(model.settings);
        })
        .then(function(){
          $scope.form.$setPristine();
        });
    };
});
