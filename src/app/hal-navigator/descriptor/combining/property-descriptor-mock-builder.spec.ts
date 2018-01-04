import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';
import SpyObj = jasmine.SpyObj;
import {FormField} from '@hal-navigator/form/form-field';

export class PropertyDescriptorMockBuilder<T extends PropertyDescriptor> {
  private mockedFunctions: string[] = [];
  private returnValues: any = {};

  withFormField(formField: FormField): PropertyDescriptorMockBuilder<T> {
    this.returnValues.toFormField = formField;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withName(name: string): PropertyDescriptorMockBuilder<T> {
    this.returnValues.getName = name;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withChildren(children: Array<PropertyDescriptor>): PropertyDescriptorMockBuilder<T> {
    this.returnValues.getChildren = children;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withResolveAssociatedResourceName(resolvedResourceName: string): PropertyDescriptorMockBuilder<T> {
    this.returnValues.resolveAssociatedResourceName = resolvedResourceName;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withNotifyAssociatedResource(): PropertyDescriptorMockBuilder<T> {
    this.mockedFunctions.push('notifyAssociatedResource');
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withResolveAssociation(): PropertyDescriptorMockBuilder<T> {
    this.mockedFunctions.push('resolveAssociation');
    return this as PropertyDescriptorMockBuilder<T>;
  }

  build(): SpyObj<T> {
    const methodNames = this.mockedFunctions.concat(Object.keys(this.returnValues));
    const mock = jasmine.createSpyObj<T>('resourceDescriptor', methodNames);
    Object.keys(this.returnValues).forEach(key => mock[key].and.returnValue(this.returnValues[key]));
    return mock;
  }
}
