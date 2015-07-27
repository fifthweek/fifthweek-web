describe('view-subscribers-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var initializer;
  var blogRepositoryFactory;
  var blogRepository;
  var blogStub;
  var errorFacade;

  beforeEach(function() {
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getChannelMap', 'getUserId']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    blogStub = jasmine.createSpyObj('blogStub', ['getSubscriberInformation']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module('webApp');
    module(function($provide) {
      $provide.value('initializer', initializer);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('blogStub', blogStub);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    blogRepository.getUserId.and.returnValue('userId');
    inject(function ($controller) {
      target = $controller('viewSubscribersCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set isLoading to false', function(){
      expect($scope.model.isLoading).toBe(false);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set subscribers to an empty list', function(){
      expect($scope.model.subscribers).toEqual([]);
    });

    it('should set totalRevenue to undefined', function(){
      expect($scope.model.totalRevenue).toBeUndefined();
    });

    it('should get an account settings repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should set the userId', function(){
      expect($scope.model.userId).toBe('userId');
    });

    it('should call initialize', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when processSubscribers is called', function(){
      describe('when no subscribers', function(){
        beforeEach(function(){
          $scope.model.estimatedWeeklyRevenue = undefined;
          $scope.model.totalSubscriptions = undefined;
          $scope.model.unacceptablePrices = undefined;

          $scope.model.subscribers = [];

          target.internal.processSubscribers();
        });

        it('should set estimatedWeeklyRevenue to zero', function(){
          expect($scope.model.estimatedWeeklyRevenue).toBe(0);
        });

        it('should set totalSubscriptions to zero', function(){
          expect($scope.model.totalSubscriptions).toBe(0);
        });

        it('should set unacceptablePrices to zero', function(){
          expect($scope.model.unacceptablePrices).toBe(0);
        });
      });

      describe('when subscribers exist', function(){
        beforeEach(function(){
          $scope.model.estimatedWeeklyRevenue = undefined;
          $scope.model.totalSubscriptions = undefined;
          $scope.model.unacceptablePrices = undefined;

          target.internal.blog = {
            channels: {
              id1: {
                price: 10,
                name: 'name1'
              },
              id2: {
                price: 20,
                name: 'name2'
              }
            }
          };

          $scope.model.subscribers =
            [
              {
                freeAccessEmail: 'one@test.com',
                channels: [
                  {
                    channelId: 'id1',
                    acceptedPrice: 0
                  },
                  {
                    channelId: 'id2',
                    acceptedPrice: 0
                  }
                ]
              },
              {
                channels: [
                  {
                    channelId: 'id1',
                    acceptedPrice: 10
                  }
                ]
              },
              {
                channels: [
                  {
                    channelId: 'id1',
                    acceptedPrice: 1
                  },
                  {
                    channelId: 'id2',
                    acceptedPrice: 50
                  }
                ]
              }
            ];

          target.internal.processSubscribers();
        });

        it('should set estimatedWeeklyRevenue', function(){
          expect($scope.model.estimatedWeeklyRevenue).toBe(30);
        });

        it('should set totalSubscriptions', function(){
          expect($scope.model.totalSubscriptions).toBe(4);
        });

        it('should set unacceptablePrices', function(){
          expect($scope.model.unacceptablePrices).toBe(1);
        });
      });
    });

    describe('when loadForm is called', function(){
      var success;
      var error;
      var deferredGetChannelMap;
      var deferredGetSubscriberInformation;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredGetChannelMap = $q.defer();
        blogRepository.getChannelMap.and.returnValue(deferredGetChannelMap.promise);

        deferredGetSubscriberInformation = $q.defer();
        blogStub.getSubscriberInformation.and.returnValue(deferredGetSubscriberInformation.promise);

        spyOn(target.internal, 'processSubscribers');
        $scope.model.isLoading = undefined;

        target.internal.loadForm().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call getChannelMap', function(){
        expect(blogRepository.getChannelMap).toHaveBeenCalledWith();
      });

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      describe('when getChannelMap succeeds', function(){
        beforeEach(function(){
          deferredGetChannelMap.resolve({ blogId: 'blogId' });
          $scope.$apply();
        });

        it('should set blog', function(){
          expect(target.internal.blog).toEqual({ blogId: 'blogId' });
        });

        it('should call getSubscriberInformation', function(){
          expect(blogStub.getSubscriberInformation).toHaveBeenCalledWith('blogId');
        });

        describe('when getSubscriberInformation succeeds', function(){
          beforeEach(function(){
            deferredGetSubscriberInformation.resolve({ data: { subscribers: 'subscribers', totalRevenue: 'totalRevenue' }});
            $scope.$apply();
          });

          it('should set the subscribers', function(){
            expect($scope.model.subscribers).toBe('subscribers');
          });

          it('should set the totalRevenue', function(){
            expect($scope.model.totalRevenue).toBe('totalRevenue');
          });

          it('should call processSubscribers', function(){
            expect(target.internal.processSubscribers).toHaveBeenCalledWith();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getSubscriberInformation fails', function(){
          beforeEach(function(){
            deferredGetSubscriberInformation.reject('error');
            $scope.$apply();
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoading to false', function(){
            expect($scope.model.isLoading).toBe(false);
          });
        });
      });

      describe('when getChannelMap fails', function(){
        beforeEach(function(){
          deferredGetChannelMap.reject('error');
          $scope.$apply();
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });
      });
    });

    describe('when calling initialize', function(){
      var success;
      var error;
      var deferredLoadForm;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoadForm = $q.defer();
        spyOn(target.internal, 'loadForm').and.returnValue(deferredLoadForm.promise);

        target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call loadForm', function(){
        expect(target.internal.loadForm).toHaveBeenCalledWith();
      });

      describe('when loadForm succeeds', function(){
        beforeEach(function(){
          deferredLoadForm.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when loadForm fails', function(){
        beforeEach(function(){
          deferredLoadForm.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
