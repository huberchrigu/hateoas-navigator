import SpyObj = jasmine.SpyObj;
import {FormFieldBuilder} from '../../form/form-field-builder';
import {PropertyDescriptor} from '../property-descriptor';

export class PropertyDescriptorMockBuilder<T extends PropertyDescriptor> {
  protected mockedFunctions: string[] = [];
  protected returnValues: any = {};

  withFormFieldBuilder(formField: FormFieldBuilder): PropertyDescriptorMockBuilder<T> {
    this.returnValues.toFormFieldBuilder = formField;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withName(name: string): PropertyDescriptorMockBuilder<T> {
    this.returnValues.getName = name;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withChildrenDescriptors(children: Array<PropertyDescriptor>): PropertyDescriptorMockBuilder<T> {
    this.returnValues.getChildrenDescriptors = children;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withAssociatedResourceName(resolvedResourceName: string): PropertyDescriptorMockBuilder<T> {
    this.returnValues.getAssociatedResourceName = resolvedResourceName;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withArrayItemsDescriptor(arrayItem: PropertyDescriptor) {
    this.returnValues.getArrayItemsDescriptor = arrayItem;
    return this;
  }

  build(): SpyObj<T> {
    const methodNames = this.mockedFunctions.concat(Object.keys(this.returnValues));
    const mock = jasmine.createSpyObj<T>('resourceDescriptor', methodNames);
    Object.keys(this.returnValues).forEach(key => mock[key].and.returnValue(this.returnValues[key]));
    return mock;
  }
}
