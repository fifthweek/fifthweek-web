describe('post-utilities', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $state;
  var accessSignatures;
  var accountSettingsRepository;
  var blogRepository;
  var subscriptionRepository;

  var states;
  var fifthweekConstants;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessMap']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlogMap']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getBlogMap']);

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

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the channel map', function(){
        expect(blogRepository.getBlogMap).not.toHaveBeenCalled();
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

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the channel map', function(){
        expect(blogRepository.getBlogMap).not.toHaveBeenCalled();
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

    describe('when getBlogMap fails', function(){
      var error;
      var posts;
      var postsCopy;
      beforeEach(function(){

        posts = [
          {
            channelId: 'channelId1',
            queueId: 'queueId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        blogRepository.getBlogMap.and.returnValue($q.reject('error'));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository)
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
            queueId: 'queueId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        blogRepository.getBlogMap.and.returnValue($q.when());
        accountSettingsRepository.getAccountSettings.and.returnValue($q.reject('error'));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should get the channel map', function(){
        expect(blogRepository.getBlogMap).toHaveBeenCalledWith();
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
            queueId: 'queueId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        blogRepository.getBlogMap.and.returnValue($q.when({
          name: 'blog',
          channels: {
            channelId1: {
              channelId: 'channelId1',
            },
            channelId2: {
              channelId: 'channelId2'
            }
          },
          queues: {
            queueId1: {
              queueId: 'queueId1'
            }
          }
        }));

        accountSettingsRepository.getAccountSettings.and.returnValue($q.when({
          username: 'username',
          profileImage: {
            fileId: 'fileId',
            containerName: 'containerName'
          }
        }));

        target.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository);
        $rootScope.$apply();
      });

      it('should get the channel map', function(){
        expect(blogRepository.getBlogMap).toHaveBeenCalledWith();
      });

      it('should get the account settings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
      });

      it('should update the posts queue', function(){
        expect(posts).toEqual([
          {
            isOwner: true,
            blogName: 'blog',
            channelId: 'channelId1',
            queueId: 'queueId1',
            channel: {
              channelId: 'channelId1'
            },
            queue: {
              queueId: 'queueId1'
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
            isOwner: true,
            blogName: 'blog',
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

  describe('when populating post creator information', function(){

    beforeEach(function(){
      spyOn(target.internal, 'populateUnknownCreatorInformation').and.callThrough();
    });

    describe('when posts is undefined', function(){
      var error;
      var posts;
      beforeEach(function(){
        error = undefined;
        posts = undefined;

        target.populateCreatorInformation(posts, subscriptionRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the blog map', function(){
        expect(subscriptionRepository.getBlogMap).not.toHaveBeenCalled();
      });

      it('should not populate unknown creator information', function(){
        expect(target.internal.populateUnknownCreatorInformation).not.toHaveBeenCalled();
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

        target.populateCreatorInformation(posts, subscriptionRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not get the blog map', function(){
        expect(subscriptionRepository.getBlogMap).not.toHaveBeenCalled();
      });

      it('should not populate unknown creator information', function(){
        expect(target.internal.populateUnknownCreatorInformation).not.toHaveBeenCalled();
      });

      it('should not error', function(){
        expect(error).toBeUndefined();
      });

      it('should not have modified posts', function(){
        expect(posts).toEqual([]);
      });
    });

    describe('when getBlogMap fails', function(){
      var error;
      var posts;
      var postsCopy;
      beforeEach(function(){

        posts = [
          {
            channelId: 'channelId1',
            queueId: 'queueId1'
          },
          {
            channelId: 'channelId2'
          }
        ];

        postsCopy = _.cloneDeep(posts);

        subscriptionRepository.getBlogMap.and.returnValue($q.reject('error'));

        target.populateCreatorInformation(posts, subscriptionRepository)
          .catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not populate unknown creator information', function(){
        expect(target.internal.populateUnknownCreatorInformation).not.toHaveBeenCalled();
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
            blogId: 'blogId1',
            channelId: 'channelId1',
            queueId: 'queueId1'
          },
          {
            blogId: 'blogId1',
            channelId: 'channelId2'
          }
        ];

        subscriptionRepository.getBlogMap.and.returnValue($q.when(
          {
            blogId1: {
              blogId: 'blogId1',
              username: 'username',
              name: 'blog',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              },
              channels: {
                channelId1: {
                  channelId: 'channelId1'
                },
                channelId2: {
                  channelId: 'channelId2'
                }
              },
              queues: {
                queueId1: {
                  queueId: 'queueId1'
                }
              }
            }
          }));

        target.populateCreatorInformation(posts, subscriptionRepository);
        $rootScope.$apply();
      });

      it('should get the blog map', function(){
        expect(subscriptionRepository.getBlogMap).toHaveBeenCalledWith();
      });

      it('should populate unknown creator information', function(){
        expect(target.internal.populateUnknownCreatorInformation).toHaveBeenCalled();
      });

      it('should update the posts queue', function(){
        expect(posts).toEqual([
          {
            isOwner: false,
            blogId: 'blogId1',
            blogName: 'blog',
            channelId: 'channelId1',
            queueId: 'queueId1',
            channel: {
              channelId: 'channelId1'
            },
            queue: {
              queueId: 'queueId1'
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
            isOwner: false,
            blogId: 'blogId1',
            blogName: 'blog',
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

    describe('when items not found', function(){
      var posts;
      beforeEach(function(){

        posts = [
          {
            blogId: 'blogId1',
            channelId: 'channelId1',
            queueId: 'queueId1'
          },
          {
            blogId: 'blogId1',
            channelId: 'channelId1',
            queueId: 'queueId2'
          },
          {
            blogId: 'blogId1',
            channelId: 'channelId2',
            queueId: 'queueId2'
          },
          {
            blogId: 'blogId2',
            channelId: 'channelId2',
            queueId: 'queueId2'
          }
        ];

        subscriptionRepository.getBlogMap.and.returnValue($q.when(
          {
            blogId1: {
              blogId: 'blogId1',
              name: 'blog',
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              },
              channels: {
                channelId1: {
                  channelId: 'channelId1'
                }
              },
              queues: {
                queueId1: {
                  queueId: 'queueId1'
                }
              }
            }
          }));

        target.populateCreatorInformation(posts, subscriptionRepository);
        $rootScope.$apply();
      });

      it('should get the blog map', function(){
        expect(subscriptionRepository.getBlogMap).toHaveBeenCalledWith();
      });

      it('should populate unknown creator information', function(){
        expect(target.internal.populateUnknownCreatorInformation).toHaveBeenCalled();
      });

      it('should update the posts queue', function(){
        expect(posts).toEqual([
          {
            isOwner: false,
            blogId: 'blogId1',
            channelId: 'channelId1',
            queueId: 'queueId1',
            channel: {
              channelId: 'channelId1'
            },
            queue: {
              queueId: 'queueId1'
            },
            blogName: 'blog',
            creator: {
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              }
            }
          },
          {
            isOwner: false,
            blogId: 'blogId1',
            channelId: 'channelId1',
            queueId: 'queueId2',
            channel: {
              channelId: 'channelId1'
            },
            queue: {
              queueId: 'queueId2',
              name: 'Unknown Queue'
            },
            blogName: 'blog',
            creator: {
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              }
            }
          },
          {
            isOwner: false,
            blogId: 'blogId1',
            channelId: 'channelId2',
            queueId: 'queueId2',
            channel: {
              channelId: 'channelId2',
              name: 'Unknown Channel'
            },
            queue: {
              queueId: 'queueId2',
              name: 'Unknown Queue'
            },
            blogName: 'blog',
            creator: {
              username: 'username',
              profileImage: {
                fileId: 'fileId',
                containerName: 'containerName'
              }
            }
          },
          {
            isOwner: false,
            blogId: 'blogId2',
            channelId: 'channelId2',
            queueId: 'queueId2',
            channel: {
              channelId: 'channelId2',
              name: 'Unknown Channel'
            },
            queue: {
              queueId: 'queueId2',
              name: 'Unknown Queue'
            },
            blogName: 'Unknown Blog',
            creator: {
              username: 'Unknown Creator',
              profileImage: undefined
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
            queueId: 'queueId1'
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
            }
          };
        });

        posts = [
          {
            liveDate: new Date('2015-03-18T17:00:00Z'),
            creator: {
              profileImage: {
                fileId: 'creator1',
                containerName: 'containerName1'
              }
            },
            queueId: 'queueId1'
          },
          {
            liveDate: new Date('2015-03-19T17:00:00Z'),
            fileSource: {
              size: 1024
            },
            creator: {
              profileImage: {
                fileId: 'creator2',
                containerName: 'containerName2'
              }
            },
            queueId: undefined
          },
          {
            liveDate: new Date('2015-03-19T17:00:00Z'),
            imageSource: {
              size: 1048576,
              contentType: 'image/jpeg',
              renderSize: {
                width: 800,
                height: 600
              }
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
              contentType: 'image/png'
            },
            image: {
              fileId: 'fileId2',
              containerName: 'containerName2'
            },
            fileSource: {
              size: 1024
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
        expect(posts[3].fileSource.readableSize).toBe('1 KB');
      });

      it('should add isScheduled data', function(){
        expect(posts[0].isScheduled).toBe(true);
        expect(posts[1].isScheduled).toBe(true);
        expect(posts[2].isScheduled).toBe(false);
        expect(posts[3].isScheduled).toBe(false);
      });

      it('should add a reorder function if the post is scheduled', function(){
        expect(posts[0].reorder).toBeDefined();
        expect(posts[1].reorder).toBeUndefined();
        expect(posts[2].reorder).toBeUndefined();
        expect(posts[3].reorder).toBeUndefined();
      });

      describe('when calling re-order', function(){
        it('should change state to the queue reorder page when reorder is called on post 1', function(){
          posts[0].reorder();
          expect($state.go).toHaveBeenCalledWith('creator.posts.scheduled.queues.reorder', { id: 'queueId1' });
        });
      });

      it('should add dayGrouping data if the day differs from the previous post', function(){
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(true);
        expect(posts[2].dayGrouping).toBe(false);
        expect(posts[3].dayGrouping).toBe(true);
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

      it('should add renderSizeRatio data when required', function(){
        expect(posts[0].renderSizeRatio).toBeUndefined();
        expect(posts[1].renderSizeRatio).toBeUndefined();
        expect(posts[2].renderSizeRatio).toBe('75%');
        expect(posts[3].renderSizeRatio).toBeUndefined();
      });
    });
  });

  describe('when removing a post', function(){

    var day1;
    var day2;

    beforeEach(function(){
      day1 = moment(new Date('2015-03-22T10:00:00Z'));
      day2 = moment(new Date('2015-03-23T10:00:00Z'));
    });

    it('should do nothing if the post list is undefined', function(){
      target.removePost(undefined, 'd');
    });

    it('should do nothing if the post list is empty', function(){
      target.removePost([], 'd');
    });

    it('should not modify the list if the post is not found', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false },
        { postId: 'c', moment: day1, dayGrouping: false }
      ];

      target.removePost(posts, 'd');

      expect(posts).toEqual([
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false },
        { postId: 'c', moment: day1, dayGrouping: false }
      ]);
    });

    it('should remove the post correctly re-group by day (1)', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false },
        { postId: 'c', moment: day1, dayGrouping: false }
      ];

      target.removePost(posts, 'a');

      expect(posts).toEqual([
        { postId: 'b', moment: day1, dayGrouping: true },
        { postId: 'c', moment: day1, dayGrouping: false }
      ]);
    });

    it('should remove the post correctly re-group by day (2)', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false },
        { postId: 'c', moment: day1, dayGrouping: false }
      ];

      target.removePost(posts, 'b');

      expect(posts).toEqual([
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'c', moment: day1, dayGrouping: false }
      ]);
    });

    it('should remove the post correctly re-group by day (3)', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false },
        { postId: 'c', moment: day1, dayGrouping: false }
      ];

      target.removePost(posts, 'c');

      expect(posts).toEqual([
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day1, dayGrouping: false }
      ]);
    });

    it('should remove the post correctly re-group by day (4)', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'b', moment: day2, dayGrouping: true },
        { postId: 'c', moment: day2, dayGrouping: false }
      ];

      target.removePost(posts, 'b');

      expect(posts).toEqual([
        { postId: 'a', moment: day1, dayGrouping: true },
        { postId: 'c', moment: day2, dayGrouping: true },
      ]);
    });

    it('should remove the post correctly re-group by day (5)', function(){
      var posts = [
        { postId: 'a', moment: day1, dayGrouping: true }
      ];

      target.removePost(posts, 'a');

      expect(posts).toEqual([
      ]);
    });
  });

  describe('when calling replacePostAndReorderIfRequired', function(){
    var changedMoment;
    beforeEach(function(){
      changedMoment = moment(1);
    });

    it('should remove the post if it has become scheduled on the timeline', function(){
      var post = { postId: 'a', isScheduled: true };
      var posts = [post];
      target.replacePostAndReorderIfRequired(false, posts, undefined, post);
      expect(posts.length).toBe(0);
    });

    it('should not remove the post if it has not become scheduled on the timeline', function(){
      var post = { postId: 'a', isScheduled: false };
      var posts = [post];
      target.replacePostAndReorderIfRequired(false, posts, undefined, post);
      expect(posts.length).toBe(1);
      expect(posts[0]).toBe(post);
    });

    it('should remove the post if it has become unscheduled on the backlog', function(){
      var post = { postId: 'a', isScheduled: false };
      var posts = [post];
      target.replacePostAndReorderIfRequired(true, posts, undefined, post);
      expect(posts.length).toBe(0);
    });

    it('should not remove the post if it has not become unscheduled on the backlog', function(){
      var post = { postId: 'a', isScheduled: true };
      var posts = [post];
      target.replacePostAndReorderIfRequired(true, posts, undefined, post);
      expect(posts.length).toBe(1);
      expect(posts[0]).toBe(post);
    });

    describe('when on the backlog', function(){
      it('should not reorder the posts if the post moment has not changed', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(100) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, moment(post2.moment), post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should replace the post if the order has not changed', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(100) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        var newPost2 = _.cloneDeep(post2);
        newPost2.moment = post2.moment;
        target.replacePostAndReorderIfRequired(true, posts, moment(post2.moment), newPost2);
        expect(posts[0]).toBe(post1);
        expect(posts[1]).not.toBe(post2);
        expect(posts[1]).toBe(newPost2);
        expect(posts[2]).toBe(post3);
      });

      it('should replace the post if the order has changed', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(10) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        var newPost2 = _.cloneDeep(post2);
        newPost2.moment = post2.moment;
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, newPost2);
        expect(posts[0]).not.toBe(post2);
        expect(posts[0]).toBe(newPost2);
        expect(posts[1]).toBe(post1);
        expect(posts[2]).toBe(post3);
      });

      it('should reorder the posts ascending 1', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(40) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should reorder the posts ascending 2', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(10) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, post2);
        expect(posts).toEqual([post2, post1, post3]);
      });

      it('should reorder the posts ascending 3', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(80) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post3, post2]);
      });

      it('should reorder the posts with the modified one last if the dates match 1', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(20) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should reorder the posts with the modified one last if the dates match 2', function(){
        var post1 = { postId: '1', isScheduled: true, moment: moment(20) };
        var post2 = { postId: '2', isScheduled: true, moment: moment(20) };
        var post3 = { postId: '3', isScheduled: true, moment: moment(60) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(true, posts, changedMoment, post1);
        expect(posts).toEqual([post2, post1, post3]);
      });
    });

    describe('when on the timeline', function(){
      it('should not reorder the posts if the post moment has not changed', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(100) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, moment(post2.moment), post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should inherit dayGrouping if the post moment has not changed', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(100), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        var newPost2 = _.cloneDeep(post2);
        newPost2.dayGrouping = true;
        newPost2.moment = post2.moment;
        target.replacePostAndReorderIfRequired(false, posts, moment(post2.moment), newPost2);
        expect(posts).toEqual([post1, post2, post3]);
        expect(newPost2.dayGrouping).toBe(false);
      });

      it('should replace the post if the order has not changed', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(100) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        var newPost2 = _.cloneDeep(post2);
        newPost2.moment = post2.moment;
        target.replacePostAndReorderIfRequired(false, posts, moment(post2.moment), newPost2);
        expect(posts[0]).toBe(post1);
        expect(posts[1]).not.toBe(post2);
        expect(posts[1]).toBe(newPost2);
        expect(posts[2]).toBe(post3);
      });

      it('should replace the post if the order has changed', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(10) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        var newPost2 = _.cloneDeep(post2);
        newPost2.moment = post2.moment;
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, newPost2);
        expect(posts[0]).toBe(post1);
        expect(posts[1]).toBe(post3);
        expect(posts[2]).not.toBe(post2);
        expect(posts[2]).toBe(newPost2);
      });

      it('should reorder the posts descending 1', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(40) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should reorder the posts descending 2', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(10) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post3, post2]);
      });

      it('should reorder the posts descending 3', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(80) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post2, post1, post3]);
      });

      it('should reorder the posts with the modified one first if the dates match 1', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(20) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post2, post3]);
      });

      it('should reorder the posts with the modified one first if the dates match 2', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment(60) };
        var post2 = { postId: '2', isScheduled: false, moment: moment(20) };
        var post3 = { postId: '3', isScheduled: false, moment: moment(20) };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post3);
        expect(posts).toEqual([post1, post3, post2]);
      });

      it('should update day grouping 1', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment('2015-01-15T05'), dayGrouping: true};
        var post2 = { postId: '2', isScheduled: false, moment: moment('2015-01-15T04'), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment('2015-01-15T03'), dayGrouping: false };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post2, post3]);
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(false);
        expect(posts[2].dayGrouping).toBe(false);
      });

      it('should update day grouping 2', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment('2015-01-15T05'), dayGrouping: true };
        var post2 = { postId: '2', isScheduled: false, moment: moment('2015-01-15T02'), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment('2015-01-15T03'), dayGrouping: false };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post3, post2]);
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(false);
        expect(posts[2].dayGrouping).toBe(false);
      });

      it('should update day grouping 3', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment('2015-01-15T05'), dayGrouping: true };
        var post2 = { postId: '2', isScheduled: false, moment: moment('2015-01-15T06'), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment('2015-01-15T03'), dayGrouping: false };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post2, post1, post3]);
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(false);
        expect(posts[2].dayGrouping).toBe(false);
      });

      it('should update day grouping 4', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment('2015-01-15T05'), dayGrouping: true };
        var post2 = { postId: '2', isScheduled: false, moment: moment('2015-01-16T04'), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment('2015-01-15T03'), dayGrouping: false };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post2, post1, post3]);
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(true);
        expect(posts[2].dayGrouping).toBe(false);
      });

      it('should update day grouping 5', function(){
        var post1 = { postId: '1', isScheduled: false, moment: moment('2015-01-15T05'), dayGrouping: true };
        var post2 = { postId: '2', isScheduled: false, moment: moment('2015-01-14T04'), dayGrouping: false };
        var post3 = { postId: '3', isScheduled: false, moment: moment('2015-01-15T03'), dayGrouping: false };
        var posts = [post1, post2,  post3];
        target.replacePostAndReorderIfRequired(false, posts, changedMoment, post2);
        expect(posts).toEqual([post1, post3, post2]);
        expect(posts[0].dayGrouping).toBe(true);
        expect(posts[1].dayGrouping).toBe(false);
        expect(posts[2].dayGrouping).toBe(true);
      });
    });
  });
});
