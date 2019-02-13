import {PropertyFactory} from './factory/property-factory';
import {JsonValueType} from './value-type/json-value-type';
import {JsonProperty} from './json-property';
import {JsonArrayPropertyImpl} from './json-array-property-impl';

describe('JsonArrayPropertyImpl', () => {
  it('should transform an array to a display value', () => {
    const propertyFactory = jasmine.createSpyObj<PropertyFactory<JsonValueType>>('propertyFactory', {
      create: jasmine.createSpyObj<JsonProperty<JsonValueType>>('jsonProperty', {
        getDisplayValue: 'value'
      })
    });
    const testee = new JsonArrayPropertyImpl('array', ['value', 'value'], null, propertyFactory);

    expect(testee.getDisplayValue()).toEqual('value, value');
  });
});
