var CommonWorkflows = require('../../common-workflows.js');
var HeaderPage = require('../../pages/header-edit-profile.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('customize landing page page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderPage();
  var sidebar = new SidebarPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.editProfileLink.click();
  });

  header.includeBasicTests(header.profileInformationLink);

  sidebar.includeEstablishedCreatorTests(sidebar.editProfileLink);
});
