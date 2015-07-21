(function(){
  'use strict';

  var CommonWorkflows = require('../common-workflows.js');
  var HeaderPage = require('../pages/header-subscriptions.page.js');
  var SidebarPage = require('../pages/sidebar.page.js');

  describe('payment-information page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    describe('when an established creator', function(){
      it('should run once before all', function() {
        commonWorkflows.createBlog();
        sidebar.subscriptionsLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeEstablishedCreatorTests(sidebar.subscriptionsLink);
    });

    describe('when a new creator', function(){
      it('should run once before all', function() {
        commonWorkflows.register();
        sidebar.subscriptionsLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeNewCreatorTests(sidebar.subscriptionsLink);
    });

    describe('when a consumer', function(){
      it('should run once before all', function() {
        commonWorkflows.registerAsConsumer();
        sidebar.subscriptionsLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeConsumerTests(sidebar.subscriptionsLink);
    });
  });
})();
