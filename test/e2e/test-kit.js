'use strict';

var _ = require('lodash');
var TestKit = function() {};

TestKit.prototype = Object.create({}, {
  punctuation33: { value: '!@£$%^&*()_+-={}[]:"|;\'\\`,./<>?±§'},
  assertSingleValidationMessage: { value: function(helpMessages, message) {
    expect(helpMessages.count()).toBe(1);
    expect(helpMessages.get(0).getText()).toContain(message);
  }},
  assertRequired: { value: function(helpMessages, field) {
    this.assertSingleValidationMessage(helpMessages, 'A ' + field + ' is required.');
  }},
  assertMinLength: { value: function(helpMessages, length) {
    this.assertSingleValidationMessage(helpMessages, 'Must be at least ' + length + ' characters.');
  }},
  assertMaxLength: { value: function(helpMessages, textBox, overSizedValue, length) {
    // Some browsers don't honor maxlength attribute with protractor's sendKeys
    // so we also check the ng-maxlength error as a backup.
    helpMessages.count().then(function(count){
      if (count) {
        expect(count).toBe(1);
        expect(helpMessages.get(0).getText()).toContain('Allowed ' + length + ' characters at most.')
      }
      else{
        expect(textBox.getAttribute('value')).toBe(overSizedValue.substring(0, length));
      }
    });
  }},
  rebaseLinkAndClick: { value: function(linkElement) {
    return linkElement.getAttribute('href').then(function(href) {
      var pathArray = href.split( '/' );
      var protocol = pathArray[0];
      var host = pathArray[2];
      var baseUrl = protocol + '//' + host;
      var path = href.substring(baseUrl.length);

      browser.waitForAngular(); // Not automatically awaited on get.
      return browser.get(path).then(function() {
        return path;
      });
    });
  }},
  clearForm: { value: function(page, inputs) {
    _.forEach(inputs, function(input) {
      var inputName = input.name;
      if (_.endsWith(inputName, 'TextBox')) {
        page[inputName].clear();
      }
    });
  }},
  setFormValues: { value: function(page, inputs, values, setDefaultValues) {
    if (setDefaultValues === undefined) {
      setDefaultValues = true;
    }

    var newValues = {};

    // If non-default values are provided, make sure they actually correspond to existing inputs rather than silently
    // ignoring them.
    if (values) {
      _.forOwn(values, function (value, key) {
        if (!_.some(inputs, {name: key})) {
          throw 'The given value "' + key + '" does not match any of the inputs';
        }
      });
    }

    _.forEach(inputs, function(input) {
      var inputName = input.name;
      var valueSpecified = values && values[inputName] !== undefined;

      if (setDefaultValues || valueSpecified) {
        var value = valueSpecified ? values[inputName] : input.newValue();
        newValues[inputName] = value;

        if (_.endsWith(inputName, 'TextBox')) {
          page[inputName].clear();
          page[inputName].sendKeys(value);
        }
        else if (_.endsWith(inputName, 'Checkbox')) {
          page[inputName].isSelected().then(function(currentValue) {
            if (currentValue != value)  {
              page[inputName].click();
            }
          });
        }
        else {
          throw 'Unknown inputName type: ' + inputName;
        }
      }
    });

    return newValues;
  }},
  expectFormValues: { value: function(page, values) {
    _.forOwn(values, function(value, inputName) {
      if (_.endsWith(inputName, 'TextBox')) {
        expect(page[inputName].getAttribute('value')).toBe(value);
      }
      else if (_.endsWith(inputName, 'Checkbox')) {
        expect(page[inputName].isSelected()).toBe(value);
      }
      else {
        throw 'Unknown inputName type: ' + inputName;
      }
    });
  }},
  itShouldHaveWellBehavedSubmitButton: { value: function(page, inputs, button) {
    it('should be disabled until changes are made', function(){
      expect(button.isEnabled()).toBe(false);
    });

    _.forEach(inputs, function(input) {
      var inputName = input.name;
      it('should become enabled after changing "' + inputName + '"', function(){
        if (_.endsWith(inputName, 'TextBox')) {
          page[inputName].clear();
        }
        else if (_.endsWith(inputName, 'Checkbox')) {
          page[inputName].click();
        }
        else {
          throw 'Unknown inputName type: ' + inputName;
        }

        expect(button.isEnabled()).toBe(true);
      });
    });
  }},
  includeHappyPaths: { value: function(page, inputs, inputName, inputPage, allNewValues, saveNewValues) {
    if (allNewValues === undefined) {
      allNewValues = true;
    }

    var self = this;
    inputPage.includeHappyPaths(function(newValue, newValueNormalized) {
      var valuesToTest = {};
      valuesToTest[inputName] = newValue;
      var newFormValues = self.setFormValues(page, inputs, valuesToTest, allNewValues);

      if (newValueNormalized) {
        // Input page object has stated that the persisted value is expected to be different from the one entered.
        newFormValues[inputName] = newValueNormalized;
      }

      if (_.isFunction(saveNewValues)) {
        saveNewValues(newFormValues)
      }
    });
  }}
});

module.exports = TestKit;
