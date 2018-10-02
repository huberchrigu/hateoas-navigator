import {FormFieldBuilder} from '../../form/form-field-builder';
import {PropertyDescriptor} from '../property-descriptor';

export class AssociatedPropertyDescriptor implements PropertyDescriptor {
  constructor(private descriptor: PropertyDescriptor, protected associatedResource: AssociatedPropertyDescriptor,
              private associatedChildren: Array<AssociatedPropertyDescriptor>, private associatedArrayItems: AssociatedPropertyDescriptor) {
    if (!descriptor) {
      throw new Error('Descriptor must not be null');
    } else {
      this.assertArray(associatedChildren);
    }
  }

  update(associatedResource: AssociatedPropertyDescriptor, associatedChildren: AssociatedPropertyDescriptor[],
         associatedArrayItems: AssociatedPropertyDescriptor): void {
    this.assertArray(associatedChildren);
    this.associatedResource = associatedResource;
    this.associatedChildren = associatedChildren;
    this.associatedArrayItems = associatedArrayItems;
  }

  getAssociatedResourceName(): string {
    return this.descriptor.getAssociatedResourceName();
  }

  getTitle(): string {
    return this.descriptor.getTitle();
  }

  getName(): string {
    return this.descriptor.getName();
  }

  getChildrenDescriptors(): Array<AssociatedPropertyDescriptor> {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedChildren);
    return this.associatedChildren;
  }

  getArrayItemsDescriptor(): AssociatedPropertyDescriptor {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedArrayItems);
    return this.associatedArrayItems;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.descriptor.toFormFieldBuilder();
  }

  getChildDescriptor(resourceName: string): AssociatedPropertyDescriptor {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedResource);
    if (this.associatedResource) {
      return this.associatedResource.getChildDescriptor(resourceName);
    } else {
      return this.associatedChildren.find(c => c.getName() === resourceName);
    }
  }

  private static assertWasDefined(value: any) {
    if (value === undefined) {
      throw new Error('Was not defined');
    }
  }

  private assertArray(associatedChildren: AssociatedPropertyDescriptor[]) {
    if (associatedChildren !== undefined && !Array.isArray(associatedChildren)) {
      throw new Error(this.descriptor.getName() + ' has non-empty children param: ' + JSON.stringify(associatedChildren));
    }
  }
}
