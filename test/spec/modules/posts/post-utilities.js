describe('post-utilities', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $state;
  var accessSignatures;
  var accountSettingsRepository;
  var channelRepository;

  var states;
  var fifthweekConstants;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessMap']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannelMap']);

    module('webApp');

    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('accessSignatures', accessSignatures);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('postUtilities');

      states = $injector.get('states');
      fifthweekConstants = $injector.get('fifthweekConstants');
    });
  });

  describe('when populating current creator information', function(){

    describe('when posts is undefined', function(){
      var error;
      var posts;
      beforeEach(function(){
        error = undefined;
        posts = undefined;

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the channel map', function(){
        expect(channelRepository.getChannelMap).not.toHaveBeenCalled();
      });

      it('should not get the account settings', function(){
        expect(accountSettingsRepository.getAccountSettings).not.toHaveBeenCalled();
      });

      it('should not error', function(){
        expect(error).toBeUndefined();
      });

      it('should not have modified posts', function(){
        expect(posts).toBeUndefined();
      });
    });

    describe('when posts is empty', function(){
      var error;
      var posts;
      beforeEach(function(){
        error = undefined;
        posts = [];

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the channel map', function(){
        expect(channelRepository.getChannelMap).not.toHaveBeenCalled();
      });

      it('should not get the account settings', function(){
        expect(accountSettingsRepository.getAccountSettings).not.toHaveBeenCalled();
      });

      it('should not error', function(){
        expect(error).toBeUndefined();
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual([]);
      });
    });

    describe('when getChannelMap fails', function(){
      var error;
      var posts;
      var postsCopy;
      beforeEach(function(){

        posts = [
          {
            channelId: 'channelId1',
            collectionId: 'collectionId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        channelRepository.getChannelMap.and.returnValue($q.reject('error'));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the account settings', function(){
        expect(accountSettingsRepository.getAccountSettings).not.toHaveBeenCalled();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual(postsCopy);
      });
    });

    describe('when getAccountSettings fails', function(){
      var error;
      var posts;
      var postsCopy;
      beforeEach(function(){

        posts = [
          {
            channelId: 'channelId1',
            collectionId: 'collectionId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        channelRepository.getChannelMap.and.returnValue($q.when());
        accountSettingsRepository.getAccountSettings.and.returnValue($q.reject('error'));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should get the channel map', function(){
        expect(channelRepository.getChannelMap).toHaveBeenCalledWith();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual(postsCopy);
      });
    });

    describe('when successful', function(){
      var posts;
      beforeEach(function(){

        posts = [
          {
            channelId: 'channelId1',
            collectionId: 'collectionId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        channelRepository.getChannelMap.and.returnValue($q.when({
          channelId1: {
            channelId: 'channelId1',
            collections: {
              collectionId1: {
                collectionId: 'collectionId1'
              }
            }
          },
          channelId2: {
            channelId: 'channelId2'
          }
        }));

        accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
          username: 'username',
          profileImage: {
            fileId: 'fileId',
            containerName: 'containerName'
          }
        }));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository);
        $rootScope.$apply();
      });

      it('should get the channel map', function(){
        expect(channelRepository.getChannelMap).toHaveBeenCalledWith();
      });

      it('should get the account settings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      it('should update the posts collection', function(){
        expect(posts).toEqual([
          {
            channelId: 'channelId1',
            collectionId: 'collectionId1',
            channel: {
              channelId: 'channelId1',
              collections: {
                collectionId1: {
                  collectionId: 'collectionId1'
                }
              }
            },
            collection: {
              collectionId: 'collectionId1'
            },
            creator: {
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              }
            }
          },
          {
            channelId: 'channelId2',
            channel: {
              channelId: 'channelId2'
            },
            creator: {
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              }
            }
          }
        ]);
      });
    });
  });

  describe('when processing posts for rendering', function(){

    describe('when posts is undefined', function(){
      var error;
      var posts;
      beforeEach(function(){
        error = undefined;
        posts = undefined;

        target.processPostsForRendering(posts)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the access signatures', function(){
        expect(accessSignatures.getContainerAccessMap).not.toHaveBeenCalled();
      });

      it('should not error', function(){
        expect(error).toBeUndefined();
      });

      it('should not have modified posts', function(){
        expect(posts).toBeUndefined();
      });
    });

    describe('when posts is empty', function(){
      var error;
      var posts;
      beforeEach(function(){
        error = undefined;
        posts = [];

        target.processPostsForRendering(posts)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the access signatures', function(){
        expect(accessSignatures.getContainerAccessMap).not.toHaveBeenCalled();
      });

      it('should not error', function(){
        expect(error).toBeUndefined();
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual([]);
      });
    });

    describe('when getContainerAccessMap fails', function(){
      var error;
      var posts;
      var postsCopy;
      beforeEach(function(){
        accessSignatures.getContainerAccessMap.and.returnValue($q.reject('error'));

        posts = [
          {
            channelId: 'channelId1',
            collectionId: 'collectionId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        target.processPostsForRendering(posts).catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual(postsCopy);
      });
    });

    describe('when successful', function(){
      var posts;
      beforeEach(function(){

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date('2015-03-19T17:00:00Z'));

        accessSignatures.getContainerAccessMap.and.returnValue($q.when({
          containerName1: {
            signature: '?signature1',
            uri: 'uri1'
          },
          containerName2: {
            signature: '?signature2',
            uri: 'uri2'
          }
        }));

        spyOn(window, 'moment').and.callFake(function(date){
          return {
            date: date,
            fromNow: function(){
              return 'fromNow';
            },
            isSame: function(previous){
              return date.getUTCDate() === previous.date.getUTCDate();
            },
            format: function(){
              return 'format';
            }
          };
        });

        posts = [
          {
            liveDate: new Date('2015-03-18T17:00:00Z'),
            scheduledByQueue: true,
            creator: {
              profileImage: {
                fileId: 'creator1',
                containerName: 'containerName1'
              }
            },
            collectionId: 'collectionId1'
          },
          {
            liveDate: new Date('2015-03-19T17:00:00Z'),
            fileSource: {
              size: 1024
            },
            scheduledByQueue: false,
            creator: {
              profileImage: {
                fileId: 'creator2',
                containerName: 'containerName2'
              }
            },
            collectionId: 'collectionId2'
          },
          {
            liveDate: new Date('2015-03-19T17:00:00Z'),
            imageSource: {
              size: 1048576,
              contentType: 'image/jpeg'
            },
            image: {
              fileId: 'fileId1',
              containerName: 'containerName1'
            },
            creator: {
              profileImage: {
                fileId: 'creator1',
                containerName: 'containerName1'
              }
            }
          },
          {
            liveDate: new Date('2015-03-20T17:00:00Z'),
            imageSource: {
              size: 8,
              contentType: 'image/tiff'
            },
            image: {
              fileId: 'fileId2',
              containerName: 'containerName2'
            },
            creator: {
              profileImage: undefined
            }
          }
        ];

        target.processPostsForRendering(posts);
        $rootScope.$apply();
      });

      afterEach(function(){
        jasmine.clock().uninstall();
      });

      it('should get the access signatures', function(){
        expect(accessSignatures.getContainerAccessMap).toHaveBeenCalled();
      });

      it('should add liveIn data', function(){
        expect(posts[0].liveIn).toBe('fromNow');
        expect(posts[1].liveIn).toBe('fromNow');
        expect(posts[2].liveIn).toBe('fromNow');
        expect(posts[3].liveIn).toBe('fromNow');
      });

      it('should add file information if post is a non-viewable image', function(){
        expect(posts[2].fileSource).toBeUndefined();
        expect(posts[3].fileSource).toBeDefined();
      });

      it('should add readableSize data', function(){
        expect(posts[1].fileSource.readableSize).toBe('1 KB');
        expect(posts[2].imageSource.readableSize).toBe('1 MB');
        expect(posts[3].imageSource.readableSize).toBe('8 bytes');
        expect(posts[3].fileSource.readableSize).toBe('8 bytes');
      });

      it('should add viewable data', function(){
        expect(posts[2].imageSource.viewable).toBe(true);
        expect(posts[3].imageSource.viewable).toBe(false);
        expect(posts[3].fileSource.viewable).toBe(false);
      });

      it('should add isScheduled data', function(){
        expect(posts[0].isScheduled).toBe(true);
        expect(posts[1].isScheduled).toBe(true);
        expect(posts[2].isScheduled).toBe(false);
        expect(posts[3].isScheduled).toBe(false);
      });

      it('should add a reorder function if the post is scheduled', function(){
        expect(posts[0].reorder).toBeDefined();
        expect(posts[1].reorder).toBeDefined();
        expect(posts[2].reorder).toBeUndefined();
        expect(posts[3].reorder).toBeUndefined();
      });

      describe('when calling re-order', function(){
        it('should change state to the queue reorder page when reorder is called on post 1', function(){
          posts[0].reorder();
          expect($state.go).toHaveBeenCalledWith('creators.backlog.queues.reorder', { id: 'collectionId1' });
        });

        it('should change state to the queue reorder page when reorder is called on post 2', function(){
          posts[1].reorder();
          expect($state.go).toHaveBeenCalledWith('creators.backlog.queues.reorder', { id: 'collectionId2' });
        });
      });

      it('should add dayGrouping data if the post is not scheduled and the day differs from the previous post', function(){
        expect(posts[0].dayGrouping).toBeUndefined();
        expect(posts[1].dayGrouping).toBeUndefined();
        expect(posts[2].dayGrouping).toBeUndefined();
        expect(posts[3].dayGrouping).toBe('format');
      });

      it('should add profile image resolvedUri data', function(){
        expect(posts[0].creator.profileImage.resolvedUri).toBe('uri1/creator1/footer?signature1');
        expect(posts[1].creator.profileImage.resolvedUri).toBe('uri2/creator2/footer?signature2');
        expect(posts[2].creator.profileImage.resolvedUri).toBe('uri1/creator1/footer?signature1');
        expect(posts[3].creator.profileImage).toBeUndefined();
      });

      it('should add image resolvedUri data', function(){
        expect(posts[2].image.resolvedUri).toBe('uri1/fileId1/feed?signature1');
        expect(posts[3].image.resolvedUri).toBe('uri2/fileId2/feed?signature2');
      });
    });
  });
});
