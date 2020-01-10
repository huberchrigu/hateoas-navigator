import {PropertyFactory} from '../factory/property-factory';
import {JsonValueType} from '../value-type/json-value-type';
import {JsonArrayPropertyImpl} from './json-array-property-impl';
import {GenericProperty, PropDescriptor} from 'hateoas-navigator/hal-navigator';

describe('JsonArrayPropertyImpl', () => {
  it('should transform an array to a display value', () => {
    const propertyFactory = jasmine.createSpyObj<PropertyFactory<JsonValueType>>('propertyFactory', {
      create: jasmine.createSpyObj<GenericProperty<JsonValueType, PropDescriptor>>('jsonProperty', {
        getDisplayValue: 'value'
      })
    });
    const testee = new JsonArrayPropertyImpl('array', ['value', 'value'], null, propertyFactory);

    expect(testee.getDisplayValue()).toEqual('value, value');
  });
});
