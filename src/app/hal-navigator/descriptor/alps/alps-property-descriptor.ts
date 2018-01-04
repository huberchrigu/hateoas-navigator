import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AlpsDescriptor} from 'app/hal-navigator/alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from 'app/hal-navigator/alps-document/alps-descriptor-adapter';
import {FormField} from 'app/hal-navigator/form/form-field';
import {AlpsFormField} from '@hal-navigator/descriptor/alps/alps-form-field';
import {LOGGER} from '../../../logging/logger';

export class AlpsPropertyDescriptor implements PropertyDescriptor {
  constructor(private alps: AlpsDescriptor) {
  }

  getTitle(): string {
    return undefined;
  }

  getName(): string {
    return this.alps.name;
  }

  getChild(resourceName: string): PropertyDescriptor {
    return this.resolveChild(resourceName);
  }

  getChildren(): Array<PropertyDescriptor> {
    if (!this.alps.descriptors) {
      return [];
    }
    return this.alps.descriptors.map(d => this.resolveChild(d.name));
  }

  getAssociatedResourceName(): string {
    if (this.alps.rt) {
      return new AlpsDescriptorAdapter(this.alps).getCollectionResourceName();
    }
    return null;
  }

  toFormField(): FormField {
    return new AlpsFormField(this);
  }

  private resolveChild(resourceName: string) {
    if (this.alps.rt) {
      LOGGER.warn(`The ALPS descriptor ${this.getName()} has a resource type attribute,` +
        `which might include a reference that was not resolved`);
    }
    if (!this.alps.descriptors) {
      return null;
    }
    const descriptor = this.alps.descriptors.find(d => d.name === resourceName);
    if (descriptor) {
      return new AlpsPropertyDescriptor(descriptor);
    }
    return null;
  }
}
