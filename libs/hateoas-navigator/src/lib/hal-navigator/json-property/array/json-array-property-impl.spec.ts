import {PropertyFactory} from '../factory/property-factory';
import {JsonValueType} from '../value-type';
import {ArrayPropertyImpl} from './array-property-impl';
import {GenericProperty} from '../generic-property';
import {ArrayDescriptor, GenericPropertyDescriptor} from '../../descriptor';

describe('ArrayPropertyImpl', () => {
  it('should transform an array to a display value', () => {
    const propertyFactory = jasmine.createSpyObj<PropertyFactory<JsonValueType>>('propertyFactory', {
      create: jasmine.createSpyObj<GenericProperty<JsonValueType, GenericPropertyDescriptor>>('jsonProperty', {
        getDisplayValue: 'value'
      })
    });
    const testee = new ArrayPropertyImpl('array', ['value', 'value'], {} as ArrayDescriptor, propertyFactory as PropertyFactory<string>);

    expect(testee.getDisplayValue()).toEqual('value, value');
  });
});
