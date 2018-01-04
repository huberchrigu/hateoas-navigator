import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';
import {FormField} from '@hal-navigator/form/form-field';

export class AssociatedDescriptor implements PropertyDescriptor {
  constructor(private descriptor: PropertyDescriptor, private associatedResource: AssociatedDescriptor,
              private associatedChildren: Array<AssociatedDescriptor>) {
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

  getChildren(): Array<AssociatedDescriptor> {
    return this.associatedChildren;
  }

  toFormField(): FormField {
    return this.descriptor.toFormField();
  }

  getChild(resourceName: string): AssociatedDescriptor {
    if (this.associatedResource) {
      return this.associatedResource.getChild(resourceName);
    } else {
      return this.associatedChildren.find(c => c.getName() === resourceName);
    }
  }
}
