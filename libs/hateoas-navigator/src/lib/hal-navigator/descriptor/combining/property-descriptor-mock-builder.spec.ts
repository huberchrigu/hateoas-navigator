import SpyObj = jasmine.SpyObj;
import SpyObjMethodNames = jasmine.SpyObjMethodNames;
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ArrayDescriptor, AssociationDescriptor, ObjectDescriptor, GenericPropertyDescriptor} from '../generic-property-descriptor';
import Spy = jasmine.Spy;
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {ResourceObjectDescriptor} from '../resource-object-descriptor';

export class PropertyDescriptorMockBuilder<T extends GenericPropertyDescriptor> {
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

export class ObjectDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ObjectDescriptor> {
  withChildrenDescriptors(children: Array<GenericPropertyDescriptor>) {
    this.methodNames.getChildDescriptors = children;
    return this;
  }
}

export class ResourceDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ResourceObjectDescriptor> {
  withChildrenDescriptors(children: Array<GenericPropertyDescriptor>) {
    this.methodNames.getChildDescriptors = children;
    return this;
  }

  withChildDescriptor(child: GenericPropertyDescriptor) {
    this.methodNames.getChildDescriptor = child;
    return this;
  }
}

export class ArrayDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ArrayDescriptor> {
  withArrayItemsDescriptor(arrayItem: GenericPropertyDescriptor) {
    this.methodNames.getItemsDescriptor = arrayItem;
    return this;
  }
}

export class AssociationDescriptorMockBuilder extends PropertyDescriptorMockBuilder<AssociationDescriptor> {
  withAssociatedResourceName(resolvedResourceName: string) {
    this.methodNames.getAssociatedResourceName = resolvedResourceName;
    this.methodNames.resolveResource = null;
    this.methodNames.setResolvedResource = null;
    this.methodNames.getResource = null;
    return this;
  }

  withAssociatedResource(resource: ResourceObjectDescriptor) {
    this.methodNames.getResource = resource;
    return this;
  }

  protected postConstruct(spy: jasmine.SpyObj<AssociationDescriptor>): jasmine.SpyObj<AssociationDescriptor> {
    const resourceName = this.methodNames.getAssociatedResourceName;
    if (resourceName) {
      spy.resolveResource.and.callFake((descriptorProvider: ResourceDescriptorProvider) => descriptorProvider.resolve(resourceName));
    }
    if (spy.setResolvedResource && !this.methodNames.getResource) {
      let resource;
      spy.setResolvedResource.and.callFake(r => resource = r);
      spy.getResource.and.callFake(() => resource);
    }
    return super.postConstruct(spy);
  }
}
