describe('channel name formatter', function() {
  'use strict';

  var target;

  beforeEach(function() {
    module('webApp');
    inject(function($injector) {
      target = $injector.get('channelNameFormatter');
    });
  });

  describe('when getting the "share with" name', function() {
    it('should set the default channel name to be "Share with everyone"', function () {
      var result = target.shareWith({
        name: 'Irrelevant',
        isDefault: true
      });
      expect(result).toBe('Share with everyone');
    });

    it('should set the other channel names to be "[channelName] Only"', function () {
      var result = target.shareWith({
        name: 'Foo',
        isDefault: false
      });
      expect(result).toBe('"Foo" Only');
    });
  });
});
