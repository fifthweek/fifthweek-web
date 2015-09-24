(function(){
  'use strict';

  var CommonWorkflows = require('../common-workflows.js');
  var HeaderPage = require('../pages/header-account.page.js');
  var SidebarPage = require('../pages/sidebar.page.js');

  describe('payment-information page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    describe('when an established creator', function(){
      it('should run once before all', function() {
        commonWorkflows.createBlog();
        sidebar.accountLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeEstablishedCreatorTests(sidebar.accountLink);
    });

    describe('when a new creator', function(){
      it('should run once before all', function() {
        commonWorkflows.register();
        sidebar.accountLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeNewCreatorTests(sidebar.accountLink);
    });

    describe('when a consumer', function(){
      it('should run once before all', function() {
        commonWorkflows.registerAsConsumer();
        sidebar.accountLink.click();
        header.paymentLink.click();
      });

      header.includeBasicTests(header.paymentLink);

      sidebar.includeConsumerTests(sidebar.accountLink);
    });
  });
})();
