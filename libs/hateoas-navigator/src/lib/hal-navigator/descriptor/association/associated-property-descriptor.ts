import {FormFieldBuilder} from '../../form/form-field-builder';
import {PropertyDescriptor} from '../property-descriptor';

export class AssociatedPropertyDescriptor implements PropertyDescriptor {
  constructor(private descriptor: PropertyDescriptor, protected associatedResource: AssociatedPropertyDescriptor,
              private associatedChildren: Array<AssociatedPropertyDescriptor>, private associatedArrayItems: AssociatedPropertyDescriptor) {
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

  getChildrenDescriptors(): Array<AssociatedPropertyDescriptor> {
    return this.associatedChildren;
  }

  getArrayItemsDescriptor(): AssociatedPropertyDescriptor {
    return this.associatedArrayItems;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.descriptor.toFormFieldBuilder();
  }

  getChildDescriptor(resourceName: string): AssociatedPropertyDescriptor {
    if (this.associatedResource) {
      return this.associatedResource.getChildDescriptor(resourceName);
    } else {
      return this.associatedChildren.find(c => c.getName() === resourceName);
    }
  }
}
