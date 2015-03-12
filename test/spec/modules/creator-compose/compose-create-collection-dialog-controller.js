describe('composeCreateCollectionDialogCtrl', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var $state;
  var composeUtilities;

  beforeEach(function() {

    $state = jasmine.createSpyObj('$state', ['reload']);
    composeUtilities = jasmine.createSpyObj('composeUtilities', ['getCollectionNameForSelection']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('composeUtilities', composeUtilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    $scope.$close = jasmine.createSpy('$close');
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composeCreateCollectionDialogCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function() {

    describe('when no model exist', function(){
      it('should throw an error', function(){
        try{
          $scope.model = undefined;
          createController();
          fail('This should not occur');
        }
        catch(error){
          expect(error.message).toBe('Scope did not contain any model.');
        }
      });
    });

    describe('when no collections exist', function(){
      it('should throw an error', function(){
        try{
          $scope.model = { channels: [] };
          createController();
          fail('This should not occur');
        }
        catch(error){
          expect(error.message).toBe('Scope did not contain any collections.');
        }
      });
    });

    describe('when no channels exist', function(){
      it('should throw an error', function(){
        try{
          $scope.model = { collections: [] };
          createController();
          fail('This should not occur');
        }
        catch(error){
          expect(error.message).toBe('Scope did not contain any channels.');
        }
      });
    });

    describe('when channels and collections exist', function(){
      it('should create successfully', function(){
        try{
          $scope.model = { channels: [], collections: [] };
          createController();
        }
        catch(error){
          fail('This should not occur');
        }
      });
    });
  });

  describe('when submitted for the first time', function(){
    beforeEach(function(){
      $scope.model = { channels: [{}], collections: [{}] };
      $scope.model.input = {
        selectedChannel: $scope.model.channels[0],
        newCollectionName: 'newCollection'
      };

      composeUtilities.getCollectionNameForSelection.and.returnValue('name');

      createController();
      $scope.submit();
    });

    it('should add a new collection to the collections list', function(){
      expect($scope.model.collections.length).toBe(2);
      expect($scope.model.collections[1].name).toBe('name');
    });

    it('should set the selected collection to the new collection', function(){
      expect($scope.model.input.selectedCollection).toBe($scope.model.collections[1]);
    });
  });

  describe('when submitted after the first time', function(){
    beforeEach(function(){
      $scope.model = { channels: [{}], collections: [{}, { isNewCollection: true, name: 'name' }] };
      $scope.model.input = {
        selectedChannel: $scope.model.channels[0],
        newCollectionName: 'newCollection'
      };

      composeUtilities.getCollectionNameForSelection.and.returnValue('name2');

      createController();
      $scope.submit();
    });

    it('should add a new collection to the collections list', function(){
      expect($scope.model.collections.length).toBe(2);
      expect($scope.model.collections[1].name).toBe('name2');
    });

    it('should set the selected collection to the new collection', function(){
      expect($scope.model.input.selectedCollection).toBe($scope.model.collections[1]);
    });
  });

  describe('when submitted with a name matching an existing collection', function(){
    describe('when submitted for the first time', function(){
      beforeEach(function(){
        $scope.model = { channels: [{}], collections: [{name: 'collection 1'}, { name: 'collection 2' }, { name: 'collection 3' }] };
        $scope.model.input = {
          selectedChannel: $scope.model.channels[0],
          newCollectionName: 'newCollection'
        };

        composeUtilities.getCollectionNameForSelection.and.returnValue('collection 2');

        createController();
        $scope.submit();
      });

      it('should not add a new collection to the collections list', function(){
        expect($scope.model.collections.length).toBe(3);
      });

      it('should set the selected collection to the matching existing collection', function(){
        expect($scope.model.input.selectedCollection).toBe($scope.model.collections[1]);
      });
    });

    describe('when submitted after the first time', function(){
      beforeEach(function(){
        $scope.model = { channels: [{}], collections: [{name: 'collection 1'}, {name: 'collection 2'}, { isNewCollection: true, name: 'name' }] };
        $scope.model.input = {
          selectedChannel: $scope.model.channels[0],
          newCollectionName: 'newCollection'
        };

        composeUtilities.getCollectionNameForSelection.and.returnValue('collection 1');

        createController();
        $scope.submit();
      });

      it('should remove the existing new collection from the collections list', function(){
        expect($scope.model.collections.length).toBe(2);
        expect($scope.model.collections[0].name).toBe('collection 1');
        expect($scope.model.collections[1].name).toBe('collection 2');
      });

      it('should set the selected collection to the new collection', function(){
        expect($scope.model.input.selectedCollection).toBe($scope.model.collections[0]);
      });
    });
  });
});
