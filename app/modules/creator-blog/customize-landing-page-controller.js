angular.module('webApp').controller(
  'customizeLandingPageCtrl',
  function($scope, $q, $state, states, blogRepositoryFactory, aggregateUserStateUtilities, jsonService, blogStub, errorFacade, blobImageControlFactory, fifthweekConstants) {
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

          if(model.settings.description){
            model.settings.description = jsonService.toSirTrevor([{
              type: 'text',
              data: {
                format: 'md',
                text: model.settings.description
              }
            }
            ]);
          }

          model.username = aggregateUserStateUtilities.getUsername();
          model.landingPageUrl = fifthweekConstants.websiteRoot + model.username;

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
        description: model.settings.description ? model.settings.description.previewText : ''
      };

      return blogStub.putBlog(model.settings.blogId, blogData)
        .then(function() {
          var settingsCopy = _.cloneDeep(model.settings);
          settingsCopy.description = blogData.description;
          return blogRepository.setBlog(settingsCopy);
        })
        .then(function(){
          $scope.form.$setPristine();
        });
    };
});
