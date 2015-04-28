describe('sign-in-workflow-dialog controller', function () {
  'use strict';

  var $controller;
  var $q;
  var $scope;
  var target;

  var authenticationService;
  var $state;
  var states;

  beforeEach(function() {
    authenticationService = jasmine.createSpyObj('authenticationService', ['signIn', 'registerUser']);
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp');
    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('$state', $state);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
    });

    $scope.$close = function(){};
  });

  var initializeTarget = function() {
    target = $controller('signInWorkflowDialogCtrl', { $scope: $scope });
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      initializeTarget();
    });

    it('should set the page to register', function() {
      expect($scope.model.page).toBe($scope.pages.register);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when calling signIn', function(){
      var deferredSignIn;
      var complete;
      var error;
      beforeEach(function(){
        complete = undefined;
        error = undefined;

        deferredSignIn = $q.defer();

        authenticationService.signIn.and.returnValue(deferredSignIn.promise);
        spyOn($scope, '$close');

        $scope.signInData = 'signInData';

        $scope.signIn().then(function(){ complete = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call authenticationService.signIn', function(){
        expect(authenticationService.signIn).toHaveBeenCalledWith('signInData');
      });

      describe('when signIn succeeds', function(){
        beforeEach(function(){
          deferredSignIn.resolve();
          $scope.$apply();
        });

        it('should close the dialog with a positive result', function(){
          expect($scope.$close).toHaveBeenCalledWith(true);
        });

        it('should complete the call', function(){
          expect(complete).toBe(true);
        });
      });

      describe('when signIn fails', function(){
        beforeEach(function(){
          deferredSignIn.reject('error');
          $scope.$apply();
        });

        it('should not close the dialog', function(){
          expect($scope.$close).not.toHaveBeenCalled();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling register', function(){
      var deferredRegister;
      var deferredSignIn;
      var complete;
      var error;
      beforeEach(function(){
        complete = undefined;
        error = undefined;

        deferredRegister = $q.defer();
        deferredSignIn = $q.defer();

        authenticationService.registerUser.and.returnValue(deferredRegister.promise);
        authenticationService.signIn.and.returnValue(deferredSignIn.promise);
        spyOn($scope, '$close');

        $scope.signInData = {};
        $scope.registrationData = { username: 'username', password: 'password', email: 'email'};

        $scope.register().then(function(){ complete = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call authenticationService registerUser', function(){
        expect(authenticationService.registerUser).toHaveBeenCalledWith({ username: 'username', password: 'password', email: 'email' });
      });

      describe('when registration is successful', function(){
        beforeEach(function(){
          deferredRegister.resolve();
          $scope.$apply();
        });

        it('should populate the signInData', function(){
          expect($scope.signInData).toEqual({ username: 'username', password: 'password'});
        });

        it('should call authenticationService.signIn', function(){
          expect(authenticationService.signIn).toHaveBeenCalledWith({ username: 'username', password: 'password'});
        });

        describe('when signIn succeeds', function(){
          beforeEach(function(){
            deferredSignIn.resolve();
            $scope.$apply();
          });

          it('should close the dialog with a positive result', function(){
            expect($scope.$close).toHaveBeenCalledWith(true);
          });

          it('should complete the call', function(){
            expect(complete).toBe(true);
          });
        });

        describe('when signIn fails', function(){
          beforeEach(function(){
            deferredSignIn.reject('error');
            $scope.$apply();
          });

          it('should not close the dialog', function(){
            expect($scope.$close).not.toHaveBeenCalled();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when registration fails', function(){
        beforeEach(function(){
          deferredRegister.reject('error');
          $scope.$apply();
        });

        it('should not close the dialog', function(){
          expect($scope.$close).not.toHaveBeenCalled();
        });

        it('should not call signIn', function(){
          expect(authenticationService.signIn).not.toHaveBeenCalled();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling showSignIn', function(){
      beforeEach(function(){
        $scope.model.page = 'something';
        $scope.showSignIn();
      });

      it('should set the page to signIn', function(){
        expect($scope.model.page).toBe($scope.pages.signIn);
      });
    });

    describe('when calling showRegister', function(){
      beforeEach(function(){
        $scope.model.page = 'something';
        $scope.showRegister();
      });

      it('should set the page to register', function(){
        expect($scope.model.page).toBe($scope.pages.register);
      });
    });

    describe('when calling forgotDetails', function(){
      beforeEach(function(){
        spyOn($scope, '$close');
        $scope.forgotDetails();
      });

      it('should change to the forgot password page', function(){
        expect($state.go).toHaveBeenCalledWith(states.signIn.forgot.name);
      });

      it('should close the dialog with a negative result', function(){
        expect($scope.$close).toHaveBeenCalledWith(false);
      });
    });
  });
});
