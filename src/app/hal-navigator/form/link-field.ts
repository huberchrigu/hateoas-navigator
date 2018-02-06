import {FormField} from '@hal-navigator/form/form-field';
import {FormFieldType} from '@hal-navigator/form/form-field-type';

export class LinkField extends FormField {
  constructor(name: string, required: boolean, readOnly: boolean, title: string, private linkedResource: string) {
    super(name, FormFieldType.LINK, required, readOnly, title);
    if (!linkedResource) {
      throw new Error('Link field "' + name + '" cannot be created, because the linked resource name is missing');
    }
  }

  getLinkedResource(): string {
    return this.linkedResource;
  }
}
