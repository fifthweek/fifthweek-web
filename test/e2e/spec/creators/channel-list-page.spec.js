var CommonWorkflows = require('../../common-workflows.js');
var HeaderPage = require('../../pages/header-edit-profile.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('channel list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.editProfileLink.click();
    header.channelsLink.click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.editProfileLink);
});
