angular.module('webApp').controller('composeCreateCollectionCtrl',
  function($scope, composeUtilities) {
    'use strict';

    var model = $scope.model;

    if(!model){
      throw new FifthweekError('Scope did not contain any model.');
    }

    if(!model.collections){
      throw new FifthweekError('Scope did not contain any collections.');
    }

    if(!model.channels){
      throw new FifthweekError('Scope did not contain any channels.');
    }

    var getNewCollectionName = function(){
      return composeUtilities.getCollectionNameForSelection(model.input.selectedChannel, { name: model.input.newCollectionName });
    };

    var getNewCollection = function(){
      var name = getNewCollectionName();

      return {
        isNewCollection: true,
        name: name
      }
    };

    var updateCollections = function(){

      var newCollectionName = getNewCollectionName();
      for(var i=0; i < model.collections.length; ++i){
        if(model.collections[i].name === newCollectionName){
          model.input.selectedCollection = model.collections[i];
          _.remove(model.collections, 'isNewCollection');
          return;
        }
      }

      if(model.collections.length > 0){
        var lastCollection = model.collections[model.collections.length - 1];
        if(lastCollection.isNewCollection){
          lastCollection.name = getNewCollectionName();
          model.input.selectedCollection = lastCollection;
          return;
        }
      }

      var newCollection = getNewCollection();
      model.collections.push(newCollection);
      model.input.selectedCollection = newCollection;
    };

    $scope.submit = function(){
      updateCollections();
      $scope.$close();
    }
  });
