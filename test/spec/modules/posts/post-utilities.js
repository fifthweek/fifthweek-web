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
  var jsonService;

  var states;
  var fifthweekConstants;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessMap']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlogMap']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['getBlogMap']);
    jsonService = jasmine.createSpyObj('jsonService', ['fromJson']);

    module('webApp');

    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('accessSignatures', accessSignatures);
      $provide.value('jsonService', jsonService);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('postUtilities');

      states = $injector.get('states');
      fifthweekConstants = $injector.get('fifthweekConstants');
    });
  });

  describe('humanFileSize', function(){
    it('should return humanized file sizes', function(){
      expect(target.internal.humanFileSize(10)).toBe('10 bytes');
      expect(target.internal.humanFileSize(10000)).toBe('9.77 KB');
      expect(target.internal.humanFileSize(10000000)).toBe('9.54 MB');
      expect(target.internal.humanFileSize(10000000000)).toBe('9.31 GB');
      expect(target.internal.humanFileSize(10000000000000)).toBe('9.09 TB');
    });
  });

  describe('getImageUri', function(){
    describe('when no accessInformation', function(){
      it('should return undefined', function(){
        var result = target.internal.getImageUri({ containerName: 'cn1' }, undefined, {accessMap:{containerName:{}}});
        expect(result).toBeUndefined();
      });
    });

    describe('when accessInformation', function(){
      var caches;
      var image;
      beforeEach(function(){
        caches = {
          accessMap: {
            containerName: {
              cn1: { uri: 'uri1', signature: '?sig1' }
            }
          }
        };
        image = { containerName: 'cn1', fileId: 'fileId1' };
      });

      describe('when thumbnail exists', function(){
        it('should return uri', function(){
          var result = target.internal.getImageUri(image, 'thumb1', caches);
          expect(result).toBe('uri1/fileId1/thumb1?sig1');
        });
      });

      describe('when thumbnail does not exist', function(){
        it('should return uri', function(){
          var result = target.internal.getImageUri(image, undefined, caches);
          expect(result).toBe('uri1/fileId1?sig1');
        });
      });
    });
  });

  describe('processFileSource', function(){
    var parent;
    var source;
    beforeEach(function(){
      spyOn(target.internal, 'humanFileSize').and.returnValue('size');

      parent = {};
      source = { size: 's' };
    });

    var standardTests = function(){
      it('should call humanFileSize', function(){
        expect(target.internal.humanFileSize).toHaveBeenCalledWith('s');
      });

      it('should set the readable size', function(){
        expect(source.readableSize).toBe('size');
      });
    };

    describe('when no renderSize', function(){
      beforeEach(function(){
        target.internal.processFileSource(parent, source);
      });

      standardTests();

      it('should not set renderSizeRatio', function(){
        expect(parent.renderSizeRatio).toBeUndefined();
      });

      it('should not set renderSizeMaximumWidth', function(){
        expect(parent.renderSizeMaximumWidth).toBeUndefined();
      });
    });

    describe('when renderSize exists', function(){
      describe('when image not taller than max height', function(){
        beforeEach(function(){
          source.renderSize = { width: 1000, height: 500 };
          target.internal.processFileSource(parent, source);
        });

        standardTests();

        it('should set the render size ratio', function(){
          expect(parent.renderSizeRatio).toBe('50%');
        });

        it('should not set renderSizeMaximumWidth', function(){
          expect(parent.renderSizeMaximumWidth).toBeUndefined();
        });
      });

      describe('when image taller than max height', function(){
        beforeEach(function(){
          source.renderSize = { width: 1000, height: 2000 };
          target.internal.processFileSource(parent, source);
        });

        standardTests();

        it('should set the render size ratio', function(){
          expect(parent.renderSizeRatio).toBe('200%');
        });

        it('should set renderSizeMaximumWidth', function(){
          expect(parent.renderSizeMaximumWidth).toBe(360);
        });
      });
    });
  });

  describe('processFileInformation', function(){
    var parent;
    var information;
    beforeEach(function(){
      spyOn(target.internal, 'getImageUri');

      parent = {};
      information = { };
    });

    describe('when uri is resolved', function(){
      beforeEach(function(){
        target.internal.getImageUri.and.returnValue('uri');
        target.internal.processFileInformation(parent, information, undefined, 'caches');
      });

      it('should call getImageUri', function(){
        expect(target.internal.getImageUri).toHaveBeenCalledWith(information, 'feed', 'caches');
      });

      it('should populate the resolved uri', function(){
        expect(information.resolvedUri).toBe('uri');
      });

      it('should not be a preview', function(){
        expect(information.isPreview).toBeUndefined();
      });
    });

    describe('when uri is not resolved', function(){
      beforeEach(function(){
        target.internal.getImageUri.and.returnValue(undefined);
      });

      describe('when access information provided', function(){
        beforeEach(function(){
          target.internal.processFileInformation(parent, information, { uri: 'uri2', signature: '?sig'}, 'caches');
        });

        it('should call getImageUri', function(){
          expect(target.internal.getImageUri).toHaveBeenCalledWith(information, 'feed', 'caches');
        });

        it('should populate the resolved uri', function(){
          expect(information.resolvedUri).toBe('uri2?sig');
        });

        it('should be a preview', function(){
          expect(information.isPreview).toBe(true);
        });
      });

      describe('when no access information provided', function(){
        beforeEach(function(){
          target.internal.processFileInformation(parent, information, undefined, 'caches');
        });

        it('should call getImageUri', function(){
          expect(target.internal.getImageUri).toHaveBeenCalledWith(information, 'feed', 'caches');
        });

        it('should not populate the resolved uri', function(){
          expect(information.resolvedUri).toBeUndefined();
        });

        it('should not be a preview', function(){
          expect(information.isPreview).toBeUndefined();
        });
      });
    });
  });

  describe('processFile', function(){
    var parent;
    beforeEach(function(){
      parent = {
        renderSizeRatio: 'something',
        renderSizeMaximumWidth: 'somethingElse'
      };

      spyOn(target.internal, 'processFileSource');

      spyOn(target.internal, 'processFileInformation');
    });

    var standardTests = function(){
      it('should remove renderSizeRatio', function(){
        expect(parent.renderSizeRatio).toBeUndefined();
      });

      it('should remove renderSizeMaximumWidth', function(){
        expect(parent.renderSizeMaximumWidth).toBeUndefined();
      });
    };

    describe('when neither source nor information provided', function(){
      beforeEach(function(){
        target.internal.processFile(parent, undefined, undefined, 'accessInformation', 'caches');
      });

      standardTests();

      it('should not call processFileSource', function(){
        expect(target.internal.processFileSource).not.toHaveBeenCalled();
      });

      it('should not call processFileInformation', function(){
        expect(target.internal.processFileInformation).not.toHaveBeenCalled();
      });
    });

    describe('when source provided', function(){
      beforeEach(function(){
        target.internal.processFile(parent, undefined, 'source', 'accessInformation', 'caches');
      });

      standardTests();

      it('should call processFileSource', function(){
        expect(target.internal.processFileSource).toHaveBeenCalledWith(parent, 'source');
      });

      it('should not call processFileInformation', function(){
        expect(target.internal.processFileInformation).not.toHaveBeenCalled();
      });
    });

    describe('when information provided', function(){
      beforeEach(function(){
        target.internal.processFile(parent, 'information', undefined, 'accessInformation', 'caches');
      });

      standardTests();

      it('should not call processFileSource', function(){
        expect(target.internal.processFileSource).not.toHaveBeenCalled();
      });

      it('should call processFileInformation', function(){
        expect(target.internal.processFileInformation).toHaveBeenCalledWith(parent, 'information', 'accessInformation', 'caches');
      });
    });

    describe('when source and information provided', function(){
      beforeEach(function(){
        target.internal.processFile(parent, 'information', 'source', 'accessInformation', 'caches');
      });

      standardTests();

      it('should call processFileSource', function(){
        expect(target.internal.processFileSource).toHaveBeenCalledWith(parent, 'source');
      });

      it('should call processFileInformation', function(){
        expect(target.internal.processFileInformation).toHaveBeenCalledWith(parent, 'information', 'accessInformation', 'caches');
      });
    });
  });

  describe('calculateReadingTime', function(){
    var testNumber = 1;
    var runTest = function(previewWordCount, wordCount, imageCount, fileCount, expectedReadingTime){
      it('should populated expected reading times ' + testNumber, function(){
        ++testNumber;
        var post = {
          previewWordCount: previewWordCount,
          wordCount: wordCount,
          imageCount: imageCount,
          fileCount: fileCount
        };

        target.internal.calculateReadingTime(post);

        expect(post.readingTime).toBe(expectedReadingTime);
      });
    };

    runTest(0, 200, 0, 0, 1);
    runTest(0, 400, 0, 0, 2);
    runTest(0, 4000, 0, 0, 20);
    runTest(2000, 4000, 0, 0, 10);
    runTest(0, 0, 2, 0, 1);
    runTest(0, 0, 20, 0, 10);
    runTest(0, 0, 0, 2, 1);
    runTest(0, 0, 0, 20, 10);
    runTest(2000, 4000, 20, 20, 30);
  });

  describe('processTimestamps', function(){
    it('should set moment and liveIn date', function(){
      var moment = { fromNow: function(){ return 'fromNow'; }};
      spyOn(window, 'moment').and.returnValue(moment);
      var post = {
        liveDate: 'liveDate'
      };

      target.internal.processTimestamps(post);

      expect(post).toEqual({
        liveDate: 'liveDate',
        moment: moment,
        liveIn: 'fromNow'
      });
    });
  });

  describe('processFiles', function(){
    describe('while post contains files', function(){
      var post;
      beforeEach(function(){
        post = {
          image: 'image',
          imageSource: 'imageSource',
          imageAccessInformation: 'imageAccessInformation',
          files: [
            {
              information: 'information1',
              source: 'source1',
              accessInformation: 'accessInformation1'
            },
            {
              information: 'information2',
              source: 'source2',
              accessInformation: 'accessInformation2'
            }
          ],
          creator: {
            profileImage: {
              content: 'content'
            }
          }
        };

        spyOn(target.internal, 'processFile');
        spyOn(target.internal, 'getImageUri').and.returnValue('imageUri');

        target.internal.processFiles(post, 'caches');
      });

      it('should call processFile for each file', function(){
        expect(target.internal.processFile).toHaveBeenCalledWith(post, 'image', 'imageSource', 'imageAccessInformation', 'caches');
        expect(target.internal.processFile).toHaveBeenCalledWith(post.files[0], 'information1', 'source1', 'accessInformation1', 'caches');
        expect(target.internal.processFile).toHaveBeenCalledWith(post.files[1], 'information2', 'source2', 'accessInformation2', 'caches');
      });

      it('should call getImageUri for the profile image', function(){
        expect(target.internal.getImageUri).toHaveBeenCalledWith(post.creator.profileImage, 'footer', 'caches');
        expect(post.creator.profileImage.resolvedUri).toBe('imageUri');
      });
    });

    describe('while post does not contain files', function(){
      var post;
      beforeEach(function(){
        post = {
        };

        spyOn(target.internal, 'processFile');
        spyOn(target.internal, 'getImageUri').and.returnValue('imageUri');

        target.internal.processFiles(post, 'caches');
      });

      it('should call processFile only once', function(){
        expect(target.internal.processFile).toHaveBeenCalledWith(post, undefined, undefined, undefined, 'caches');
        expect(target.internal.processFile.calls.count()).toBe(1);
      });

      it('should call getImageUri for the profile image', function(){
        expect(target.internal.getImageUri).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('processAccess', function(){
    describe('when owner', function(){
      it('should specify correct access to post', function(){
        var post = {
          isOwner: true
        };
        var caches = {
          accountSettings: {}
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when on guest list', function(){
      it('should specify correct access to post', function(){
        var post = {
          isGuestList: true
        };
        var caches = {
          accountSettings: {}
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when subscriber with no account balance', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          channel: { price: 10, acceptedPrice: 10 }
        };
        var caches = {
          accountSettings: {}
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(false);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when subscriber with low accepted price', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          channel: { price: 10, acceptedPrice: 9 }
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(false);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(false);
      });
    });

    describe('when subscriber with high accepted price', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          channel: { price: 10, acceptedPrice: 11 }
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(false);
      });
    });

    describe('when subscriber and guest list with accepted price', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          isGuestList: true,
          channel: { price: 10, acceptedPrice: 10 }
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(false);
      });
    });

    describe('when subscriber and guest list with zero accepted price', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          isGuestList: true,
          channel: { price: 10, acceptedPrice: 0 }
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when subscriber with payment retrying', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          channel: { price: 10, acceptedPrice: 10 }
        };
        var caches = {
          accountSettings: { isRetryingPayment: true }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when subscriber with account balance and accepted price', function(){
      it('should specify correct access to post', function(){
        var post = {
          isSubscribed: true,
          channel: { price: 10, acceptedPrice: 10 }
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(true);
        expect(post.readAccessIgnoringPayment).toBe(true);
        expect(post.priceAccepted).toBe(true);
      });
    });

    describe('when not owner guest list or subscriber', function(){
      it('should specify correct access to post', function(){
        var post = {
        };
        var caches = {
          accountSettings: { accountBalance: 1 }
        };
        target.internal.processAccess(post, caches);

        expect(post.readAccess).toBe(false);
        expect(post.readAccessIgnoringPayment).toBe(false);
        expect(post.priceAccepted).toBe(true);
      });
    });
  });

  describe('processScheduledPost', function(){
    describe('when post is scheduled', function(){
      it('should set scheduled information', function(){
        var post = {
          queueId: undefined
        };

        target.internal.processScheduledPost(post);

        expect(post.isScheduled).toBe(true);
        expect(post.reorder).toBeUndefined();
      });
    });

    describe('when post is queued', function(){
      it('should set scheduled information', function(){
        var post = {
          queueId: 'queueId'
        };

        target.internal.processScheduledPost(post);

        expect(post.isScheduled).toBe(true);
        expect(post.reorder).toBeDefined();
      });
    });

    describe('when post not scheduled or queued', function(){
      it('should set scheduled information', function(){
        var post = {
        };

        target.internal.processScheduledPost(post);

        expect(post.isScheduled).toBe(false);
        expect(post.reorder).toBeUndefined();
      });
    });
  });

  describe('processContent', function(){
    describe('when post has no content', function(){
      it('should not do anything', function(){
        var post = {
        };

        target.internal.processContent(post);

        expect(post).toEqual({});
      });
    });

    describe('when post has content', function(){
      it('should process blocks', function(){
        var blocks = [
          {
            type: 'text',
            data: { text: 'blah' }
          },
          {
            type: 'something-with-file',
            data: { fileId: 'a' }
          },
          {
            type: 'something-with-file',
            data: { fileId: 'b' }
          }
        ];

        var post = {
          content: 'serializedContent',
          files: [
            {
              information: {
                fileId: 'a'
              },
              blah: 'blah1'
            },
            {
              information: {
                fileId: 'b'
              },
              blah: 'blah2'
            }
          ]
        };

        jsonService.fromJson.and.returnValue(_.cloneDeep(blocks));

        target.internal.processContent(post);

        expect(post).toEqual({
          content: 'serializedContent',
          files: [
            {
              information: {
                fileId: 'a'
              },
              blah: 'blah1'
            },
            {
              information: {
                fileId: 'b'
              },
              blah: 'blah2'
            }
          ],
          blocks: [
            {
              type: 'text',
              data: { text: 'blah' }
            },
            {
              type: 'something-with-file',
              data: { fileId: 'a' },
              information: {
                fileId: 'a'
              },
              blah: 'blah1'
            },
            {
              type: 'something-with-file',
              data: { fileId: 'b' },
              information: {
                fileId: 'b'
              },
              blah: 'blah2'
            }
          ]
        });
      });
    });
  });

  describe('processPost', function(){
    it('should call delegates', function(){
      spyOn(target.internal, 'populateCreatorInformation');
      spyOn(target.internal, 'processAccess');
      spyOn(target.internal, 'processTimestamps');
      spyOn(target.internal, 'processFiles');
      spyOn(target.internal, 'processScheduledPost');
      spyOn(target.internal, 'processContent');
      spyOn(target.internal, 'calculateReadingTime');

      target.internal.processPost('post', 'previousPost', 'caches');

      expect(target.internal.populateCreatorInformation).toHaveBeenCalledWith('post', 'caches');
      expect(target.internal.processAccess).toHaveBeenCalledWith('post', 'caches');
      expect(target.internal.processTimestamps).toHaveBeenCalledWith('post');
      expect(target.internal.processFiles).toHaveBeenCalledWith('post', 'caches');
      expect(target.internal.processScheduledPost).toHaveBeenCalledWith('post');
      expect(target.internal.processContent).toHaveBeenCalledWith('post');
      expect(target.internal.calculateReadingTime).toHaveBeenCalledWith('post');
    });
  });

  describe('processPosts', function(){
    it('should process each post', function(){
      spyOn(target.internal, 'processPost');
      target.internal.processPosts([ 'post1', 'post2', 'post3' ], 'caches');

      expect(target.internal.processPost.calls.count()).toBe(3);
      expect(target.internal.processPost).toHaveBeenCalledWith('post1', undefined, 'caches');
      expect(target.internal.processPost).toHaveBeenCalledWith('post2', 'post1', 'caches');
      expect(target.internal.processPost).toHaveBeenCalledWith('post3', 'post2', 'caches');
    });
  });

  describe('populateCreatorInformation', function(){
    var post;
    var caches;
    beforeEach(function(){
      post = {};
      caches = {};

      spyOn(target.internal, 'populateCurrentCreatorInformation');
      spyOn(target.internal, 'populateCreatorInformationFromBlog');
      spyOn(target.internal, 'populateUnknownCreatorInformation');
    });

    describe('when owner', function(){
      beforeEach(function(){
        post.creatorId = 'creatorId';
        caches.userId = 'creatorId';

        target.internal.populateCreatorInformation(post, caches);
      });

      it('should populate post correctly', function(){
        expect(post.isOwner).toBe(true);
        expect(post.isSubscribed).toBe(false);
        expect(post.isGuestList).toBe(false);
        expect(target.internal.populateCurrentCreatorInformation).toHaveBeenCalledWith(post, caches);
      });
    });

    describe('when subscribed', function(){
      beforeEach(function(){
        post.creatorId = 'creatorId';
        caches.userId = 'userId';

        post.blogId = 'blogId1';
        post.channelId = 'channelId1';

        caches.subscriptionMap = {
          blogId1: {
            freeAccess: 'freeAccess',
            channels: {
              channelId1: 'channel1'
            }
          }
        };

        target.internal.populateCreatorInformation(post, caches);
      });

      it('should populate post correctly', function(){
        expect(post.isOwner).toBe(false);
        expect(post.isSubscribed).toBe(true);
        expect(post.isGuestList).toBe(true);
        expect(target.internal.populateCreatorInformationFromBlog).toHaveBeenCalledWith(post, caches.subscriptionMap.blogId1);
      });
    });

    describe('when on guest list', function(){
      beforeEach(function(){
        post.creatorId = 'creatorId';
        caches.userId = 'userId';

        post.blogId = 'blogId1';
        post.channelId = 'channelId1';

        caches.subscriptionMap = {
          blogId1: {
            freeAccess: 'freeAccess',
            channels: {}
          }
        };

        target.internal.populateCreatorInformation(post, caches);
      });

      it('should populate post correctly', function(){
        expect(post.isOwner).toBe(false);
        expect(post.isSubscribed).toBe(false);
        expect(post.isGuestList).toBe(true);
        expect(target.internal.populateCreatorInformationFromBlog).toHaveBeenCalledWith(post, caches.subscriptionMap.blogId1);
      });
    });

    describe('when unknown', function(){
      beforeEach(function(){
        post.creatorId = 'creatorId';
        caches.userId = 'userId';

        post.blogId = 'blogId2';
        post.channelId = 'channelId1';

        caches.subscriptionMap = {
          blogId1: {
            freeAccess: 'freeAccess',
            channels: {}
          }
        };

        target.internal.populateCreatorInformation(post, caches);
      });

      it('should populate post correctly', function(){
        expect(post.isOwner).toBe(false);
        expect(post.isSubscribed).toBe(false);
        expect(post.isGuestList).toBe(false);
        expect(target.internal.populateUnknownCreatorInformation).toHaveBeenCalledWith(post);
      });
    });
  });

  describe('populateCurrentCreatorInformation', function(){
    var post;
    var caches;
    beforeEach(function(){
      post = {
        channelId: 'channelId1',
        queueId: 'queueId1'
      };
      caches = {
        blog: {
          channels: {
            channelId1: 'channel1'
          },
          queues: {
            queueId1: 'queue1'
          },
          name: 'name'
        },
        accountSettings: {
          username: 'username',
          profileImage: 'profileImage'
        }
      };
    });

    describe('when queued', function(){
      it('should populate correctly', function(){
        target.internal.populateCurrentCreatorInformation(post, caches);

        expect(post.channel).toBe('channel1');
        expect(post.queue).toBe('queue1');
        expect(post.blog).toEqual({ name: 'name' });
        expect(post.creator).toEqual({ username: 'username', profileImage: 'profileImage' });
      });
    });

    describe('when not queued', function(){
      it('should populate correctly', function(){
        post.queueId = undefined;
        target.internal.populateCurrentCreatorInformation(post, caches);

        expect(post.channel).toBe('channel1');
        expect(post.queue).toBeUndefined();
        expect(post.blog).toEqual({ name: 'name' });
        expect(post.creator).toEqual({ username: 'username', profileImage: 'profileImage' });
      });
    });
  });

  describe('populateCreatorInformationFromBlog', function(){
    var post;
    var blog;
    beforeEach(function(){
      post = {
        channelId: 'channelId1',
        queueId: 'queueId1'
      };
      blog = {
        channels: {
          channelId1: 'channel1'
        },
        queues: {
          queueId1: 'queue1'
        },
        name: 'name',
        username: 'username',
        profileImage: 'profileImage'
      };
    });

    describe('when queued', function(){
      it('should populate correctly', function(){
        target.internal.populateCreatorInformationFromBlog(post, blog);

        expect(post.channel).toBe('channel1');
        expect(post.queue).toBe('queue1');
        expect(post.blog).toEqual({ name: 'name' });
        expect(post.creator).toEqual({ username: 'username', profileImage: 'profileImage' });
      });
    });

    describe('when not queued', function(){
      it('should populate correctly', function(){
        post.queueId = undefined;
        target.internal.populateCreatorInformationFromBlog(post, blog);

        expect(post.channel).toBe('channel1');
        expect(post.queue).toBeUndefined();
        expect(post.blog).toEqual({ name: 'name' });
        expect(post.creator).toEqual({ username: 'username', profileImage: 'profileImage' });
      });
    });
  });

  describe('populateUnknownCreatorInformation', function(){
    var post;
    beforeEach(function(){
      post = {
        channelId: 'channelId1',
        queueId: 'queueId1'
      };
    });

    describe('when post is not already populated and has queueId', function(){
      it('should populate correctly', function(){
        target.internal.populateUnknownCreatorInformation(post);
        expect(post.channel).toEqual({ channelId: 'channelId1', name: 'Unknown Channel' });
        expect(post.queue).toEqual({ queueId: 'queueId1', name: 'Unknown Queue' });
        expect(post.blog).toEqual({ name: 'Unknown Blog' });
        expect(post.creator).toEqual({ username: 'Unknown Creator', profileImage: undefined });
      });
    });

    describe('when post is not already populated and has no queueId', function(){
      it('should populate correctly', function(){
        post.queueId = undefined;
        target.internal.populateUnknownCreatorInformation(post);
        expect(post.channel).toEqual({ channelId: 'channelId1', name: 'Unknown Channel' });
        expect(post.queue).toBeUndefined();
        expect(post.blog).toEqual({ name: 'Unknown Blog' });
        expect(post.creator).toEqual({ username: 'Unknown Creator', profileImage: undefined });
      });
    });

    describe('when post is already populated', function(){
      it('should populate correctly', function(){
        post.channel = 'channel';
        post.queue = 'queue';
        post.blog = 'blog';
        post.creator = 'creator';
        target.internal.populateUnknownCreatorInformation(post);
        expect(post.channel).toBe('channel');
        expect(post.queue).toBe('queue');
        expect(post.blog).toBe('blog');
        expect(post.creator).toBe('creator');
      });
    });
  });

  describe('getPopulatedCaches', function(){
    it('should populate the caches', function(){
      accessSignatures.getContainerAccessMap.and.returnValue($q.when('accessMap'));

      var accountSettingsRepository = jasmine.createSpyObj('asr', ['getAccountSettings']);
      accountSettingsRepository.getAccountSettings.and.returnValue($q.when('accountSettings'));

      var blogRepository = jasmine.createSpyObj('asr', ['tryGetBlogMap', 'getUserId']);
      blogRepository.tryGetBlogMap.and.returnValue($q.when('blogMap'));
      blogRepository.getUserId.and.returnValue('userId');

      var subscriptionRepository = jasmine.createSpyObj('asr', ['getBlogMap']);
      subscriptionRepository.getBlogMap.and.returnValue($q.when('subscriptionBlogMap'));

      var result;
      target.internal.getPopulatedCaches(accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(r){ result = r; });

      $rootScope.$apply();

      expect(result).toEqual({
        userId: 'userId',
        accessMap: 'accessMap',
        subscriptionMap: 'subscriptionBlogMap',
        blog: 'blogMap',
        accountSettings: 'accountSettings'
      });
    });
  });

  describe('processPostsForRendering', function(){
    var success;
    var error;
    var deferredGetPopulatedCaches;
    beforeEach(function(){
      success = undefined;
      error = undefined;
      deferredGetPopulatedCaches = $q.defer();
      spyOn(target.internal, 'getPopulatedCaches').and.returnValue(deferredGetPopulatedCaches.promise);
      spyOn(target.internal, 'processPosts');
    });

    describe('when no posts', function(){
      beforeEach(function(){
        target.processPostsForRendering([], 'asr', 'br', 'sr')
          .then(function(){ success = true; }, function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should not call getPopulatedCaches', function(){
        expect(target.internal.getPopulatedCaches).not.toHaveBeenCalled();
      });

      it('should complete successfully', function(){
        expect(success).toBe(true);
      });
    });

    describe('when undefined posts', function(){
      beforeEach(function(){
        target.processPostsForRendering(undefined, 'asr', 'br', 'sr')
          .then(function(){ success = true; }, function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should not call getPopulatedCaches', function(){
        expect(target.internal.getPopulatedCaches).not.toHaveBeenCalled();
      });

      it('should complete successfully', function(){
        expect(success).toBe(true);
      });
    });

    describe('when posts exist', function(){
      var posts;
      beforeEach(function(){
        posts = ['p1', 'p2'];
        target.processPostsForRendering(posts, 'asr', 'br', 'sr')
          .then(function(){ success = true; }, function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should call getPopulatedCaches', function(){
        expect(target.internal.getPopulatedCaches).toHaveBeenCalledWith('asr', 'br', 'sr');
      });

      describe('when getPopulatedCaches succeeds', function(){
        beforeEach(function(){
          deferredGetPopulatedCaches.resolve('caches');
          $rootScope.$apply();
        });

        it('should call processPosts', function(){
          expect(target.internal.processPosts).toHaveBeenCalledWith(posts, 'caches');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when getPopulatedCaches fails', function(){
        beforeEach(function(){
          deferredGetPopulatedCaches.reject('error');
          $rootScope.$apply();
        });

        it('should propagate error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });

  describe('processPostForRendering', function(){
    var success;
    var error;
    var deferredGetPopulatedCaches;
    beforeEach(function(){
      success = undefined;
      error = undefined;
      deferredGetPopulatedCaches = $q.defer();
      spyOn(target.internal, 'getPopulatedCaches').and.returnValue(deferredGetPopulatedCaches.promise);
      spyOn(target.internal, 'processPost');

      target.processPostForRendering('post', 'asr', 'br', 'sr')
        .then(function(){ success = true; }, function(e) { error = e; });
      $rootScope.$apply();
    });

    it('should call getPopulatedCaches', function(){
      expect(target.internal.getPopulatedCaches).toHaveBeenCalledWith('asr', 'br', 'sr');
    });

    describe('when getPopulatedCaches succeeds', function(){
      beforeEach(function(){
        deferredGetPopulatedCaches.resolve('caches');
        $rootScope.$apply();
      });

      it('should call processPost', function(){
        expect(target.internal.processPost).toHaveBeenCalledWith('post', undefined, 'caches');
      });

      it('should complete successfully', function(){
        expect(success).toBe(true);
      });
    });

    describe('when getPopulatedCaches fails', function(){
      beforeEach(function(){
        deferredGetPopulatedCaches.reject('error');
        $rootScope.$apply();
      });

      it('should propagate error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('removePost', function(){
    var posts;
    beforeEach(function(){
      posts = [
        {
          postId: 'p1',
          name: 'n1'
        },
        {
          postId: 'p2',
          name: 'n2'
        },
        {
          postId: 'p3',
          name: 'n3'
        }
      ];
    });

    it('should not error if no posts', function(){
      target.removePost([], 'p1');
    });

    it('should not error if posts is undefined', function(){
      target.removePost(undefined, 'p1');
    });

    it('should not error if post not found', function(){
      var original = _.cloneDeep(posts);
      target.removePost(posts, 'p5');
      expect(posts).toEqual(original);
    });

    it('should remove posts from start of list', function(){
      target.removePost(posts, 'p1');
      expect(posts).toEqual([
        {
          postId: 'p2',
          name: 'n2'
        },
        {
          postId: 'p3',
          name: 'n3'
        }
      ]);
    });

    it('should remove posts from middle of list', function(){
      target.removePost(posts, 'p2');
      expect(posts).toEqual([
        {
          postId: 'p1',
          name: 'n1'
        },
        {
          postId: 'p3',
          name: 'n3'
        }
      ]);
    });

    it('should remove posts from end of list', function(){
      target.removePost(posts, 'p3');
      expect(posts).toEqual([
        {
          postId: 'p1',
          name: 'n1'
        },
        {
          postId: 'p2',
          name: 'n2'
        }
      ]);
    });
  });

  describe('backlogComparison', function(){
    var t1;
    var t2;
    beforeEach(function(){
      t1 = moment();
      t2 = moment();
      t2.add(1, 'd');
    });

    it('should return true if first post is before second post', function(){
      expect(target.internal.backlogComparison({ moment: t1 }, { moment: t2 })).toBe(true);
    });

    it('should return false if first post is same time as second post', function(){
      expect(target.internal.backlogComparison({ moment: t1 }, { moment: t1 })).toBe(false);
    });

    it('should return false if first post is after second post', function(){
      expect(target.internal.backlogComparison({ moment: t2 }, { moment: t1 })).toBe(false);
    });
  });

  describe('timelineComparison', function(){
    var t1;
    var t2;
    beforeEach(function(){
      t1 = moment();
      t2 = moment();
      t2.add(1, 'd');
    });

    it('should return false if first post is before second post', function(){
      expect(target.internal.timelineComparison({ moment: t1 }, { moment: t2 })).toBe(false);
    });

    it('should return true if first post is same time as second post', function(){
      expect(target.internal.timelineComparison({ moment: t1 }, { moment: t1 })).toBe(true);
    });

    it('should return true if first post is after second post', function(){
      expect(target.internal.timelineComparison({ moment: t2 }, { moment: t1 })).toBe(true);
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
    });
  });
});
