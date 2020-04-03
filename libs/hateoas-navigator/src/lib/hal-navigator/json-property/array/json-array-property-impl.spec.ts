import {PropertyFactory} from '../factory/property-factory';
import {JsonValueType} from '../value-type/json-value-type';
import {ArrayPropertyImpl} from './array-property-impl';
import {GenericProperty} from '../generic-property';
import {GenericPropertyDescriptor} from '../../descriptor/generic-property-descriptor';

describe('ArrayPropertyImpl', () => {
  it('should transform an array to a display value', () => {
    const propertyFactory = jasmine.createSpyObj<PropertyFactory<JsonValueType>>('propertyFactory', {
      create: jasmine.createSpyObj<GenericProperty<JsonValueType, GenericPropertyDescriptor>>('jsonProperty', {
        getDisplayValue: 'value'
      })
    });
    const testee = new ArrayPropertyImpl('array', ['value', 'value'], null, propertyFactory);

    expect(testee.getDisplayValue()).toEqual('value, value');
  });
});
