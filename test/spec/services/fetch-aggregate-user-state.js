describe('fetch aggregate user state', function(){
  'use strict';

  var userId = 'userId';
  var newUserState = { some: { complex: 'object', unchanged: true }};
  var error = 'error';

  var $q;

  var $rootScope;
  var fetchAggregateUserStateConstants;
  var userStateStub;
  var target;

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      userStateStub = jasmine.createSpyObj('userStateStub', ['getUserState', 'getVisitorState']);

      $provide.value('userStateStub', userStateStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      fetchAggregateUserStateConstants = $injector.get('fetchAggregateUserStateConstants');
      target = $injector.get('fetchAggregateUserState');
    });
  });

  describe('when updating from the server', function() {

    it('should broadcast updated user state', function() {

      spyOn($rootScope, '$broadcast');
      userStateStub.getUserState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer(userId);
      $rootScope.$apply();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, userId, newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getUserState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer(userId).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
    });
  });

  describe('when synchronizing with server (from no user ID)', function() {

    it('should broadcast updated user state', function() {

      spyOn($rootScope, '$broadcast');
      userStateStub.getVisitorState.and.returnValue($q.when({ data: newUserState }));

      target.updateFromServer();
      $rootScope.$apply();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(fetchAggregateUserStateConstants.fetchedEvent, undefined, newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.getVisitorState.and.returnValue($q.reject(error));

      var result = null;
      target.updateFromServer().catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
    });
  });

});
