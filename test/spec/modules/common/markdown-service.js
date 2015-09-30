describe('markdown-service', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;


  beforeEach(function() {
    module('webApp');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('markdownService');
    });
  });

  describe('when createMarkdown is called', function(){
    it('should remove filtered tags and attributes', function(){
      var result = target.createMarkdown('<p>One</p><span>Two</span><p style="color: green">Three</p>');
      expect(result).toBe('One\n\nTwo\n\nThree');
    });

    it('should convert pre elements', function(){
      var result = target.createMarkdown('<p>One</p><pre>Two</pre><p>Three</p>');
      expect(result).toBe('One\n\n```\nTwo\n```\n\nThree');
    });

    it('should convert code elements', function(){
      var result = target.createMarkdown('<p>One <code>Two</code> Three</p>');
      expect(result).toBe('One `Two` Three');
    });
  });

  describe('when renderMarkdown is called', function(){
    it('should render markdown', function(){
      var result = target.renderMarkdown('# My Header\n\nOne\n\n```\nTwo\n```\n\nThree');
      expect(result).toBe('<h1 id="my-header">My Header</h1>\n<p>One</p>\n<pre>Two</pre><p>Three</p>\n');
    });
  });
});
