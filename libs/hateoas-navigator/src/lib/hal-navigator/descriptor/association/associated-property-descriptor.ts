import {FormFieldBuilder} from '../../form/form-field-builder';
import {DeprecatedPropertyDescriptor} from '../deprecated-property-descriptor';
import {AssociatedResourceDescriptor} from './associated-resource-descriptor';
import {DeprecatedResourceDescriptor} from 'hateoas-navigator';

export class AssociatedPropertyDescriptor implements DeprecatedPropertyDescriptor {
  constructor(private descriptor: DeprecatedPropertyDescriptor, protected associatedResource: AssociatedResourceDescriptor,
              private associatedChildren: Array<AssociatedResourceDescriptor>, private associatedArrayItems: AssociatedResourceDescriptor) {
    if (!descriptor) {
      throw new Error('Descriptor must not be null');
    } else {
      this.assertArray(associatedChildren);
    }
  }

  update(associatedResource: AssociatedResourceDescriptor, associatedChildren: AssociatedResourceDescriptor[],
         associatedArrayItems: AssociatedResourceDescriptor): void {
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

  getChildrenDescriptors(): Array<AssociatedResourceDescriptor> {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedChildren);
    return this.associatedChildren;
  }

  getArrayItemsDescriptor(): AssociatedResourceDescriptor {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedArrayItems);
    return this.associatedArrayItems;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.descriptor.toFormFieldBuilder();
  }

  getChildDescriptor(resourceName: string): AssociatedResourceDescriptor {
    AssociatedPropertyDescriptor.assertWasDefined(this.associatedResource);
    if (this.associatedResource) {
      return this.associatedResource.getChildDescriptor(resourceName);
    } else {
      return this.associatedChildren.find(c => c.getName() === resourceName);
    }
  }

  getChildResourceDesc(childName: string): DeprecatedResourceDescriptor {
    if (this.associatedResource) {
      return this.associatedResource.getChildResourceDesc(childName);
    } else {
      return this.getChildDescriptor(childName);
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
