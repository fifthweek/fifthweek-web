describe('collection service', function(){
  'use strict';

  var channelId = 'channelId';
  var collectionId = 'collectionId';
  var collectionName = 'collection name';
  var weeklyReleaseTime = 42;

  var $q;
  var $rootScope;
  var channelRepositoryFactory;
  var channelRepository;
  var collectionStub;
  var target;

  beforeEach(function() {
    module('webApp');

    channelRepository = jasmine.createSpyObj('channelRepository', ['createCollection']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    collectionStub = jasmine.createSpyObj('collectionStub', ['postCollection']);

    module(function($provide) {
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('collectionStub', collectionStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('collectionService');
    });

    collectionStub.postCollection.and.returnValue($q.when({ data: { collectionId: collectionId, defaultWeeklyReleaseTime: weeklyReleaseTime } }));
    channelRepository.createCollection.and.returnValue($q.when());
  });

  describe('when creating a collection from name', function(){

    it('should get the repository for the current user before any async operations begin', function() {
      var firstCall = null;
      channelRepositoryFactory.forCurrentUser = function() {
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

      expect(channelRepository.createCollection).toHaveBeenCalledWith(channelId, {
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
});
