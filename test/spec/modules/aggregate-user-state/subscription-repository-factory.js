describe('subscription repository factory', function(){
  'use strict';

  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var subscriptionRepositoryFactory;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'getUserId']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      subscriptionRepositoryFactory = $injector.get('subscriptionRepositoryFactoryConstants');
      targetFactory = $injector.get('subscriptionRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('calling getBlogs', function() {
    var expected;
    var actual;
    beforeEach(function(){
      expected = 'data';
      actual = undefined;

      masterRepository.get.and.returnValue($q.when(expected));
    });

    describe('when the user is logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        target.getBlogs().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });

    describe('when the user is not logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);
        target.getBlogs().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });
  });

  describe('calling tryGetBlogs', function() {
    var expected;
    var actual;
    beforeEach(function(){
      expected = 'data';
      actual = undefined;

      masterRepository.get.and.returnValue($q.when(expected));
    });

    describe('when the user is logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        target.tryGetBlogs().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });

    describe('when the user is not logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);
        target.tryGetBlogs().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should not call the master repository', function(){
        expect(masterRepository.get).not.toHaveBeenCalled();
      });

      it('should return the expected data', function(){
        expect(actual).toBeUndefined();
      });
    });
  });

  describe('calling getBlogMap', function() {
    describe('when the user has blog subscriptions', function(){
      var expected;
      var actual;
      beforeEach(function(){

        spyOn(target, 'tryGetBlogs').and.returnValue($q.when([
          {
            blogId: 'blogId1',
            channels: [
              {
                channelId: 'channelId1',
                collections: [
                  {
                    collectionId: 'collectionId1'
                  },
                  {
                    collectionId: 'collectionId2'
                  }
                ]
              },
              {
                channelId: 'channelId2',
                collections: [
                  {
                    collectionId: 'collectionId3'
                  }
                ]
              },
              {
                channelId: 'channelId3',
                collections: []
              }
            ]
          },
          {
            blogId: 'blogId2',
            channels: []
          }
        ]));

        expected = {
          blogId1: {
            blogId: 'blogId1',
            channels: {
              channelId1: {
                channelId: 'channelId1',
                collections: {
                  collectionId1: {
                    collectionId: 'collectionId1'
                  },
                  collectionId2: {
                    collectionId: 'collectionId2'
                  }
                }
              },
              channelId2: {
                channelId: 'channelId2',
                collections: {
                  collectionId3: {
                    collectionId: 'collectionId3'
                  }
                }
              },
              channelId3: {
                channelId: 'channelId3',
                collections: {}
              }
            }
          },
          blogId2: {
            blogId: 'blogId2',
            channels: {}
          }
        };

        target.getBlogMap().then(function(result){ actual = result; });
        $rootScope.$apply();
      });

      it('should return the expected result', function(){
        expect(actual).toEqual(expected);
      })
    });

    describe('when the user has no blog subscriptions', function(){
      var expected;
      var actual;
      beforeEach(function(){

        spyOn(target, 'tryGetBlogs').and.returnValue($q.when([]));

        expected = {};

        target.getBlogMap().then(function(result){ actual = result; });
        $rootScope.$apply();
      });

      it('should return the expected result', function(){
        expect(actual).toEqual(expected);
      })
    });

    describe('when the user is signed out', function(){
      var expected;
      var actual;
      beforeEach(function(){

        spyOn(target, 'tryGetBlogs').and.returnValue($q.when());

        expected = {};

        target.getBlogMap().then(function(result){ actual = result; });
        $rootScope.$apply();
      });

      it('should return the expected result', function(){
        expect(actual).toEqual(expected);
      })
    });
  });
});
