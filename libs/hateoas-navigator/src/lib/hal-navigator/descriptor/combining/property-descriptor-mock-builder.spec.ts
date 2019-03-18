import SpyObj = jasmine.SpyObj;
import SpyObjMethodNames = jasmine.SpyObjMethodNames;
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ArrayPropertyDescriptor, AssociationPropertyDescriptor, ObjectPropertyDescriptor, PropDescriptor} from '../prop-descriptor';
import Spy = jasmine.Spy;
import {ResourceDescriptorProvider} from 'hateoas-navigator/hal-navigator/descriptor/provider/resource-descriptor-provider';

export class PropertyDescriptorMockBuilder<T extends PropDescriptor> {
  protected methodNames = {
    toFormFieldBuilder: {} as FormFieldBuilder,
    getTitle: undefined,
    getName: undefined
  } as { [K in keyof T]: any };

  withFormFieldBuilder(formField: FormFieldBuilder): PropertyDescriptorMockBuilder<T> {
    this.methodNames.toFormFieldBuilder = formField;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  withName(name: string): PropertyDescriptorMockBuilder<T> {
    this.methodNames.getName = name;
    return this as PropertyDescriptorMockBuilder<T>;
  }

  build(): SpyObj<T> {
    const keys: (keyof T)[] = Object.keys(this.methodNames) as (keyof T)[];
    keys.push('orNull', 'orEmpty');
    const mock = jasmine.createSpyObj<T>('propDescriptor', keys as any as SpyObjMethodNames<T>);
    Object.keys(this.methodNames).forEach(key => mock[key].and.returnValue(this.methodNames[key]));
    return this.postConstruct(mock);
  }

  protected postConstruct(spy: SpyObj<T>): SpyObj<T> {
    (spy.orNull as Spy).and.callFake((factory, ...args) => factory(spy) ? factory(spy)(...args) : null);
    (spy.orEmpty as Spy).and.callFake(factory => factory(spy) ? factory(spy)() : []);
    return spy;
  }
}

export class ObjectDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ObjectPropertyDescriptor> {
  withChildrenDescriptors(children: Array<PropDescriptor>) {
    this.methodNames.getChildDescriptors = children;
    return this;
  }
}

export class ArrayDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ArrayPropertyDescriptor<PropDescriptor>> {
  withArrayItemsDescriptor(arrayItem: PropDescriptor) {
    this.methodNames.getItemsDescriptor = arrayItem;
    return this;
  }
}

export class AssociationDescriptorMockBuilder extends PropertyDescriptorMockBuilder<AssociationPropertyDescriptor> {
  withAssociatedResourceName(resolvedResourceName: string) {
    this.methodNames.getAssociatedResourceName = resolvedResourceName;
    this.methodNames.resolveResource = null;
    return this;
  }

  protected postConstruct(spy: jasmine.SpyObj<AssociationPropertyDescriptor>): jasmine.SpyObj<AssociationPropertyDescriptor> {
    const resourceName = this.methodNames.getAssociatedResourceName;
    if (resourceName) {
      spy.resolveResource.and.callFake((descriptorProvider: ResourceDescriptorProvider) => descriptorProvider.resolve(resourceName));
    }
    return super.postConstruct(spy);
  }
}
