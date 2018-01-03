import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import SpyObj = jasmine.SpyObj;
import {FormField} from '@hal-navigator/schema/form/form-field';

export class ResourceDescriptorMockBuilder<T extends ResourceDescriptor> {
  private mockedFunctions: string[] = [];
  private returnValues: any = {};

  withFormField(formField: FormField): ResourceDescriptorMockBuilder<T> {
    this.returnValues.toFormField = formField;
    return this as ResourceDescriptorMockBuilder<T>;
  }

  withName(name: string): ResourceDescriptorMockBuilder<T> {
    this.returnValues.getName = name;
    return this as ResourceDescriptorMockBuilder<T>;
  }

  withChildren(children: Array<ResourceDescriptor>): ResourceDescriptorMockBuilder<T> {
    this.returnValues.getChildren = children;
    return this as ResourceDescriptorMockBuilder<T>;
  }

  withResolveAssociatedResourceName(resolvedResourceName: string): ResourceDescriptorMockBuilder<T> {
    this.returnValues.resolveAssociatedResourceName = resolvedResourceName;
    return this as ResourceDescriptorMockBuilder<T>;
  }

  withNotifyAssociatedResource(): ResourceDescriptorMockBuilder<T> {
    this.mockedFunctions.push('notifyAssociatedResource');
    return this as ResourceDescriptorMockBuilder<T>;
  }

  withResolveAssociation(): ResourceDescriptorMockBuilder<T> {
    this.mockedFunctions.push('resolveAssociation');
    return this as ResourceDescriptorMockBuilder<T>;
  }

  build(): SpyObj<T> {
    const methodNames = this.mockedFunctions.concat(Object.keys(this.returnValues));
    const mock = jasmine.createSpyObj<T>('resourceDescriptor', methodNames);
    Object.keys(this.returnValues).forEach(key => mock[key].and.returnValue(this.returnValues[key]));
    return mock;
  }
}
