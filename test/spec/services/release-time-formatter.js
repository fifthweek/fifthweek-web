describe('release time formatter', function() {
  'use strict';

  var target;

  beforeEach(function() {
    module('webApp');
    inject(function($injector) {
      target = $injector.get('releaseTimeFormatter');
    });
  });

  describe('when getting the day of week', function() {
    it('requires a numerical input', function() {
      expect(function() {
        target.getDayOfWeek();
      }).toThrowError(FifthweekError);

      expect(function() {
        target.getDayOfWeek('hello');
      }).toThrowError(FifthweekError);

      expect(function() {
        target.getDayOfWeek({});
      }).toThrowError(FifthweekError);
    });

    it('requires non-negative numbers', function() {
      expect(function() {
        target.getDayOfWeek(-1);
      }).toThrowError(FifthweekError);
    });

    it('requires numbers under 167 are provided', function() {
      expect(function() {
        target.getDayOfWeek(168);
      }).toThrowError(FifthweekError);
    });

    it('should associate a different day with each 24 hour block', function() {
      // Day 1
      expect(target.getDayOfWeek(0)).toBe(target.getDayOfWeek(23));
      expect(target.getDayOfWeek(23)).not.toBe(target.getDayOfWeek(24));

      // Day 2
      expect(target.getDayOfWeek(24)).toBe(target.getDayOfWeek(47));
      expect(target.getDayOfWeek(47)).not.toBe(target.getDayOfWeek(48));

      // Day 3
      expect(target.getDayOfWeek(48)).toBe(target.getDayOfWeek(71));
      expect(target.getDayOfWeek(71)).not.toBe(target.getDayOfWeek(72));

      // Day 4
      expect(target.getDayOfWeek(72)).toBe(target.getDayOfWeek(95));
      expect(target.getDayOfWeek(95)).not.toBe(target.getDayOfWeek(96));

      // Day 5
      expect(target.getDayOfWeek(96)).toBe(target.getDayOfWeek(119));
      expect(target.getDayOfWeek(119)).not.toBe(target.getDayOfWeek(120));

      // Day 6
      expect(target.getDayOfWeek(120)).toBe(target.getDayOfWeek(143));
      expect(target.getDayOfWeek(143)).not.toBe(target.getDayOfWeek(144));

      // Day 7
      expect(target.getDayOfWeek(144)).toBe(target.getDayOfWeek(167));
    });

    it('should start from Sunday', function() {
      expect(target.getDayOfWeek(0)).toBe('Sunday');
    });

    it('should cover each of the 7 days', function() {
      expect(target.getDayOfWeek(0)).toBe('Sunday');
      expect(target.getDayOfWeek(24)).toBe('Monday');
      expect(target.getDayOfWeek(48)).toBe('Tuesday');
      expect(target.getDayOfWeek(72)).toBe('Wednesday');
      expect(target.getDayOfWeek(96)).toBe('Thursday');
      expect(target.getDayOfWeek(120)).toBe('Friday');
      expect(target.getDayOfWeek(144)).toBe('Saturday');
    });
  });

  describe('when getting the days of week', function() {
    it('should map inputs to the "getDayOfWeek" function', function() {
      var range = 0;
      target.getDayOfWeek = function() {
        return ++range;
      };

      expect(target.getDaysOfWeek(['a', 'b', 'c'])).toEqual([1, 2, 3]);
    });
  });

  describe('when getting the time of week', function() {
    it('should return the hour of day in 24H format', function() {
      expect(target.getTimeOfWeek(10)).toBe('10:00');
      expect(target.getTimeOfWeek(23)).toBe('23:00');
      expect(target.getTimeOfWeek(34)).toBe('10:00');
    });

    it('should prefix single digit hours with a 0', function() {
      expect(target.getTimeOfWeek(0)).toBe('00:00');
      expect(target.getTimeOfWeek(24)).toBe('00:00');
      expect(target.getTimeOfWeek(25)).toBe('01:00');
    });
  });

  describe('when getting the day and times of week', function() {
    it('should map inputs to the "getDayAndTimeOfWeek" function', function() {
      var range = 0;
      target.getDayAndTimeOfWeek = function() {
        return ++range;
      };

      expect(target.getDayAndTimesOfWeek(['a', 'b', 'c'])).toEqual([1, 2, 3]);
    });
  });
});
