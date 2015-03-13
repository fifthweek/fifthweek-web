'use strict';

describe('backlog controller', function() {
  var $q;
  var scope;
  var $state;
  var calculatedStates;
  var $modal;
  var authenticationService;
  var target;

  beforeEach(function() {
    calculatedStates = jasmine.createSpyObj('calculatedStates', [ 'getDefaultState' ]);
    $modal = {};
    authenticationService = jasmine.createSpyObj('utilities', ['signIn', 'registerUser']);

    module('webApp', 'stateMock');
    module(function($provide) {
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('$modal', $modal);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope').$new();
      scope.form = {};
      $state = $injector.get('$state');
      target = $controller('backlogPostListCtrl', { $scope: scope });
    });

    // Satisfy the 'construction precondition' by default. There only needs to be
    // one test to ensure appropriate behaviour when this condition is not met.
    authenticationService.currentUser = { authenticated: false };

    initializeTarget();
  });

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  // Split out since we have logic running in the constructor.
  function initializeTarget() {
  }

  //it('should contain an viewImage function', function(){
  //  expect(scope.viewImage).toBeDefined();
  //});

});
