import SpyObj = jasmine.SpyObj;
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ArrayPropertyDescriptor, DeprecatedPropertyDescriptor, ObjectPropertyDescriptor, PropDescriptor} from '../deprecated-property-descriptor';
import SpyObjMethodNames = jasmine.SpyObjMethodNames;
import {AssociatedPropertyDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/association/associated-property-descriptor';

export class DeprecatedPropertyDescriptorMockBuilder<T extends DeprecatedPropertyDescriptor> {
  protected methodNames = {} as { [K in keyof T]: any };

  withFormFieldBuilder(formField: FormFieldBuilder): DeprecatedPropertyDescriptorMockBuilder<T> {
    this.methodNames.toFormFieldBuilder = formField;
    return this as DeprecatedPropertyDescriptorMockBuilder<T>;
  }

  withName(name: string): DeprecatedPropertyDescriptorMockBuilder<T> {
    this.methodNames.getName = name;
    return this as DeprecatedPropertyDescriptorMockBuilder<T>;
  }

  withChildrenDescriptors(children: Array<DeprecatedPropertyDescriptor>): DeprecatedPropertyDescriptorMockBuilder<T> {
    this.methodNames.getChildrenDescriptors = children;
    return this as DeprecatedPropertyDescriptorMockBuilder<T>;
  }

  withAssociatedResourceName(resolvedResourceName: string): DeprecatedPropertyDescriptorMockBuilder<T> {
    this.methodNames.getAssociatedResourceName = resolvedResourceName;
    return this as DeprecatedPropertyDescriptorMockBuilder<T>;
  }

  withArrayItemsDescriptor(arrayItem: DeprecatedPropertyDescriptor) {
    this.methodNames.getArrayItemsDescriptor = arrayItem;
    return this;
  }

  build(): SpyObj<T> {
    return jasmine.createSpyObj<T>('resourceDescriptor', this.methodNames as SpyObjMethodNames<T>);
  }
}

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
    return jasmine.createSpyObj<T>('resourceDescriptor', this.methodNames as SpyObjMethodNames<T>);
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

export class AssociationDescriptorMockBuilder extends PropertyDescriptorMockBuilder<AssociatedPropertyDescriptor> {
  withAssociatedResourceName(resolvedResourceName: string) {
    this.methodNames.getAssociatedResourceName = resolvedResourceName;
    return this;
  }
}
