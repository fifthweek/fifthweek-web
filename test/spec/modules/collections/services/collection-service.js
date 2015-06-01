describe('collection service', function(){
  'use strict';

  var channelId = 'channelId';
  var collectionId = 'collectionId';
  var collectionName = 'collection name';
  var weeklyReleaseTime = 42;
  var weeklyReleaseTimes = [weeklyReleaseTime];

  var $q;
  var $rootScope;
  var collectionRepositoryFactory;
  var collectionRepository;
  var collectionStub;
  var target;

  var itShouldGetRepositoryForCurrentUser = function(targetMethod, stubMethod) {
    it('should get the repository for the current user before any async operations begin', function() {
      var firstCall = null;
      collectionRepositoryFactory.forCurrentUser = function() {
        firstCall = firstCall || 'good';
      };

      collectionStub[stubMethod].and.callFake(function() {
        firstCall = firstCall || 'bad';
        return $q.defer().promise;
      });

      target[targetMethod]();

      expect(firstCall).toBe('good');
    });
  };

  beforeEach(function() {
    module('webApp');

    collectionRepository = jasmine.createSpyObj('collectionRepository', ['createCollection', 'updateCollection', 'deleteCollection']);
    collectionRepositoryFactory = { forCurrentUser: function() { return collectionRepository; }};
    collectionStub = jasmine.createSpyObj('collectionStub', ['postCollection', 'putCollection', 'deleteCollection']);

    module(function($provide) {
      $provide.value('collectionRepositoryFactory', collectionRepositoryFactory);
      $provide.value('collectionStub', collectionStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('collectionService');
    });

    collectionStub.postCollection.and.returnValue($q.when({ data: { collectionId: collectionId, defaultWeeklyReleaseTime: weeklyReleaseTime } }));
    collectionStub.putCollection.and.returnValue($q.when());
    collectionStub.deleteCollection.and.returnValue($q.when());
    collectionRepository.createCollection.and.returnValue($q.when());
    collectionRepository.updateCollection.and.returnValue($q.when());
    collectionRepository.deleteCollection.and.returnValue($q.when());
  });

  describe('when creating a collection from name', function(){
    itShouldGetRepositoryForCurrentUser('createCollectionFromName', 'postCollection');

    it('should create the collection via the API', function() {
      target.createCollectionFromName(channelId, collectionName);
      $rootScope.$apply();

      expect(collectionStub.postCollection).toHaveBeenCalledWith({channelId: channelId, name: collectionName});
    });

    it('should create the collection via the channel repository', function() {
      target.createCollectionFromName(channelId, collectionName);
      $rootScope.$apply();

      expect(collectionRepository.createCollection).toHaveBeenCalledWith(channelId, {
        collectionId: collectionId,
        name: collectionName,
        weeklyReleaseSchedule: [weeklyReleaseTime]
      });
    });

    it('should return the new collection ID', function() {
      var actualResult = null;
      target.createCollectionFromName(channelId, collectionName).then(function(result) {
        actualResult = result;
      });
      $rootScope.$apply();

      expect(actualResult).toBe(collectionId);
    });
  });

  describe('when updating a collection', function() {
    var collectionData;
    beforeEach(function() {
      collectionData = {
        name: collectionName,
        weeklyReleaseSchedule: weeklyReleaseTimes
      };
    });

    itShouldGetRepositoryForCurrentUser('updateCollection', 'putCollection');

    it('should update the collection via the API', function() {
      target.updateCollection(channelId, collectionId, collectionData);
      $rootScope.$apply();

      expect(collectionStub.putCollection).toHaveBeenCalledWith(collectionId, collectionData);
    });

    it('should update the collection via the client-side repository', function() {
      target.updateCollection(channelId, collectionId, collectionData);
      $rootScope.$apply();

      expect(collectionRepository.updateCollection).toHaveBeenCalledWith(channelId, {
        collectionId: collectionId,
        name: collectionName,
        weeklyReleaseSchedule: weeklyReleaseTimes
      });
    });
  });

  describe('when deleting a collection', function() {
    itShouldGetRepositoryForCurrentUser('deleteCollection', 'deleteCollection');

    it('should delete the collection via the API', function() {
      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(collectionStub.deleteCollection).toHaveBeenCalledWith(collectionId);
    });

    it('should delete the collection from the client-side repository', function() {
      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(collectionRepository.deleteCollection).toHaveBeenCalledWith(collectionId);
    });
  });
});
