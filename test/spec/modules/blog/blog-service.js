describe('blog service', function() {
  'use strict';

  var basePrice = '1.99';
  var blogId = 'blogId';
  var channelId = 'channelId';
  var blogName = 'blogName';
  var introduction = 'introduction';
  var blogData = { name: blogName, introduction: introduction, basePrice: basePrice };
  var error = 'error';
  var userId = 'user_id';

  var $rootScope;
  var $q;
  var blogStub;
  var aggregateUserState;
  var aggregateUserStateConstants;
  var authenticationService;
  var blogRepositoryFactory;
  var blogRepository;
  var target;

  var date;

  beforeEach(function() {
    date = new Date('2015-01-11T11:11:11Z');
    jasmine.clock().install();
    jasmine.clock().mockDate(date);

    blogStub = jasmine.createSpyObj('blogStub', ['postBlog', 'putBlog']);
    aggregateUserState = {};
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRespository', ['setBlog']);
    authenticationService = { currentUser: { userId: userId }};

    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);

    module('webApp');
    module(function($provide) {
      $provide.value('blogStub', blogStub);
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('authenticationService', authenticationService);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('blogRepository', blogRepository);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      target = $injector.get('blogService');
    });

    blogStub.postBlog.and.returnValue($q.when());
    blogStub.putBlog.and.returnValue($q.when());
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  });

  it('should synchronize on initialization', function() {
    aggregateUserState.currentValue = null;
    expect(target.blogId).toBeUndefined();
    expect(target.hasBlog).toBe(false);

    aggregateUserState.currentValue = { };
    expect(target.blogId).toBeUndefined();
    expect(target.hasBlog).toBe(false);

    aggregateUserState.currentValue = { blog: null };
    expect(target.blogId).toBeUndefined();
    expect(target.hasBlog).toBe(false);

    aggregateUserState.currentValue = { blog: { blogId: blogId } };
    expect(target.blogId).toBe(blogId);
    expect(target.hasBlog).toBe(true);
  });

  describe('when creating first blog', function() {

    it('should require user to not have a blog', function() {
      aggregateUserState.currentValue = { blog: { blogId: blogId } };

      var result = null;
      target.createFirstBlog(blogData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
    });

    describe('when the user does not have a blog', function(){

      beforeEach(function(){
        aggregateUserState.currentValue = { };

        blogStub.postBlog.and.returnValue($q.when({ data: { blogId: blogId, channelId: channelId } }));

        target.createFirstBlog(blogData);
        $rootScope.$apply();
      });

      it('should persist the new blog with the API', function() {
        expect(blogStub.postBlog).toHaveBeenCalledWith(blogData);
      });

      it('should set the blog data to aggregate user state', function(){
        expect(blogRepository.setBlog).toHaveBeenCalledWith({
          blogId: blogId,
          introduction: introduction,
          name: blogName,
          creationDate: date,
          channels: [
            {
              channelId: channelId,
              name: blogName,
              price: basePrice,
              isVisibleToNonSubscribers: true
            }
          ],
          queues: []
        });
      });
    });

    it('should request a blog repository before calling the API', function() {
      aggregateUserState.currentValue = { };

      blogStub.postBlog.and.returnValue($q.when({ data: { blogId: blogId, channelId: channelId } }));

      target.createFirstBlog(blogData);

      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalled();
    });

    it('should propagate errors', function() {
      aggregateUserState.currentValue = { };

      blogStub.postBlog.and.returnValue($q.reject(error));

      var result = null;
      target.createFirstBlog(blogData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(blogStub.postBlog).toHaveBeenCalledWith(blogData);
    });
  });
});
