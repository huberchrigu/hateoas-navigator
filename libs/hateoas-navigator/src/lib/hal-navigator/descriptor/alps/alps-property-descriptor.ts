import {LOGGER} from '../../../logging/logger';
import {AbstractPropertyDescriptor} from '../abstract-property-descriptor';
import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from '../../alps-document/alps-descriptor-adapter';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {PropertyDescriptor} from '../property-descriptor';

export class AlpsPropertyDescriptor extends AbstractPropertyDescriptor {
  private static readonly REPRESENTATION_PREFIX = '-representation';

  constructor(private alps: AlpsDescriptor) {
    super(alps.name ||
      (alps.id.endsWith(AlpsPropertyDescriptor.REPRESENTATION_PREFIX) ?
          alps.id.substring(0, alps.id.length - AlpsPropertyDescriptor.REPRESENTATION_PREFIX.length) :
          undefined
      ));
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
    return this.alps.descriptors.map(d => this.toDescriptor(d));
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

  protected findDescriptor(childName: string): AlpsDescriptor {
    if (this.alps.rt) {
      LOGGER.warn(`The ALPS descriptor ${this.getName()} has a resource type attribute,` +
        `which might include a reference that was not resolved`);
    }
    if (!this.alps.descriptors) {
      return null;
    }
    return this.alps.descriptors.find(d => d.name === childName);
  }

  private resolveChild(childName: string): AlpsPropertyDescriptor {
    const descriptor = this.findDescriptor(childName);
    if (descriptor) {
      return this.toDescriptor(descriptor);
    }
    return null;
  }

  private toDescriptor(descriptor: AlpsDescriptor) {
    return new AlpsPropertyDescriptor(descriptor);
  }
}
