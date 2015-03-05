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
    var promises = _.map(inputs, function(input) {
      var inputName = input.name;
      if (_.endsWith(inputName, 'TextBox')) {
        return page[inputName].clear();
      }
    });

    return protractor.promise.all(promises);
  }},
  setFormValues: { value: function(page, inputs, nonDefaultValues) {
    var newValues = {};

    // If non-default values are provided, make sure they actually correspond to existing inputs rather than silently
    // ignoring them.
    if (nonDefaultValues) {
      _.forOwn(nonDefaultValues, function (value, key) {
        if (!_.some(inputs, {name: key})) {
          throw 'The given value "' + key + '" does not match any of the inputs';
        }
      });
    }

    var promises = _.map(inputs, function(input) {
      var inputName = input.name;
      var value = (nonDefaultValues && nonDefaultValues[inputName] !== undefined) ? nonDefaultValues[inputName] : input.newValue();
      newValues[inputName] = value;

      if (_.endsWith(inputName, 'TextBox')) {
        return page[inputName].clear().then(function() {
          return page[inputName].sendKeys(value);
        });
      }
      else if (_.endsWith(inputName, 'Checkbox')) {
        return page[inputName].isSelected().then(function(currentValue) {
          if (currentValue != value)  {
            return page[inputName].click();
          }
        });
      }
      else {
        throw 'Unknown inputName type: ' + inputName;
      }
    });

    return protractor.promise.all(promises).then(function() {
      return newValues;
    });
  }},
  expectFormValues: { value: function(page, inputs, values) {
    // expect(...).X does not return a promise, so no waiting is required.
    _.forEach(inputs, function(input) {
      var inputName = input.name;
      var value = values[inputName];

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
  itShouldHaveWellBehavedSubmitButton: { value: function(button, actions) {
    describe('submit button', function() {

      it('should be disabled until changes are made', function(){
        expect(button.isEnabled()).toBe(false);
      });

      _.forEach(actions, function(action) {
        it('should become enabled after ' + action.name, function(){
          if (_.isFunction(action.act)) {
            action.act();
          }
          else if (action.textbox) {
            action.textbox.clear();
          }
          else if (action.checkbox) {
            action.checkbox.click();
          }

          expect(button.isEnabled()).toBe(true);
          browser.refresh();
        });
      });
    });
  }},
  includeHappyPaths: { value: function(page, inputs, inputName, inputPage) {
    var self = this;
    var deferred = protractor.promise.defer();

    inputPage.includeHappyPaths(function(newValue) {
      var valuesToTest = {};
      valuesToTest[inputName] = newValue;
      return self.setFormValues(page, inputs, valuesToTest).then(function(generatedFormValues) {
        deferred.fulfill(generatedFormValues);
      });
    });

    return deferred.promise;
  }}
});

module.exports = TestKit;
