import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

export class AssociatedDescriptor implements PropertyDescriptor {
  constructor(private descriptor: PropertyDescriptor, private associatedResource: AssociatedDescriptor,
              private associatedChildren: Array<AssociatedDescriptor>, private associatedArrayItems: AssociatedDescriptor) {
    if (!descriptor) {
      throw new Error('Descriptor must not be null');
    } else if (!Array.isArray(associatedChildren)) {
      throw new Error(this.descriptor.getName() + ' has non-empty children param: ' + JSON.stringify(associatedChildren));
    }
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

  getChildrenDescriptors(): Array<AssociatedDescriptor> {
    return this.associatedChildren;
  }

  getArrayItemsDescriptor(): AssociatedDescriptor {
    return this.associatedArrayItems;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.descriptor.toFormFieldBuilder();
  }

  getChildDescriptor(resourceName: string): AssociatedDescriptor {
    if (this.associatedResource) {
      return this.associatedResource.getChildDescriptor(resourceName);
    } else {
      return this.associatedChildren.find(c => c.getName() === resourceName);
    }
  }
}
