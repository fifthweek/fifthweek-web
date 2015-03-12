describe('collection service', function(){
  'use strict';

  var channelId = 'channelId';
  var collectionId = 'collectionId';
  var collectionName = 'collection name';
  var weeklyReleaseTime = 42;

  var $q;
  var $rootScope;
  var collectionRepositoryFactory;
  var collectionRepository;
  var collectionStub;
  var target;

  beforeEach(function() {
    module('webApp');

    collectionRepository = jasmine.createSpyObj('collectionRepository', ['createCollection', 'deleteCollection']);
    collectionRepositoryFactory = { forCurrentUser: function() { return collectionRepository; }};
    collectionStub = jasmine.createSpyObj('collectionStub', ['postCollection', 'deleteCollection']);

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
    collectionRepository.createCollection.and.returnValue($q.when());
    collectionStub.deleteCollection.and.returnValue($q.defer().promise);
    collectionRepository.deleteCollection.and.returnValue($q.defer().promise);
  });

  describe('when creating a collection from name', function(){

    it('should get the repository for the current user before any async operations begin', function() {
      var firstCall = null;
      collectionRepositoryFactory.forCurrentUser = function() {
        firstCall = firstCall || 'good';
      };

      collectionStub.postCollection.and.callFake(function() {
        firstCall = firstCall || 'bad';
        return $q.defer().promise;
      });

      target.createCollectionFromName(channelId, collectionName);

      expect(firstCall).toBe('good');
    });

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

  describe('when deleting a collection', function() {
    it('should delete the collection via the API', function() {
      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(collectionStub.deleteCollection).toHaveBeenCalledWith(collectionId);
    });

    it('should delete the collection from the client-side repository', function() {
      collectionStub.deleteCollection.and.returnValue($q.when());

      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(collectionRepository.deleteCollection).toHaveBeenCalledWith(collectionId);
    });
  });
});
