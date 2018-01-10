import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AlpsDescriptor} from 'app/hal-navigator/alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from 'app/hal-navigator/alps-document/alps-descriptor-adapter';
import {LOGGER} from '../../../logging/logger';
import {AbstractPropertyDescriptor} from '@hal-navigator/descriptor/abstract-property-descriptor';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

export class AlpsPropertyDescriptor extends AbstractPropertyDescriptor {

  constructor(private alps: AlpsDescriptor) {
    super(alps.name);
  }

  getTitle(): string {
    return undefined;
  }

  getChildDescriptor(resourceName: string): PropertyDescriptor {
    return this.resolveChild(resourceName);
  }

  getChildrenDescriptors(): Array<AlpsPropertyDescriptor> {
    if (!this.alps.descriptors) {
      return [];
    }
    return this.alps.descriptors.map(d => this.resolveChild(d.name));
  }

  /**
   * Example:
   * {name: 'members', rt: 'http://...'} can be the output for a field 'members' that is actually an array.
   *
   * That is why the {@link FormFieldBuilder} cannot resolve the array descriptors immediately, otherwise this would
   * end in an endless loop.
   */
  getArrayItemsDescriptor(): AbstractPropertyDescriptor {
    return this;
  }

  getAssociatedResourceName(): string {
    if (this.alps.rt) {
      return new AlpsDescriptorAdapter(this.alps).getCollectionResourceName();
    }
    return null;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    formFieldBuilder
      .withLinkedResource(this.getAssociatedResourceName());
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
