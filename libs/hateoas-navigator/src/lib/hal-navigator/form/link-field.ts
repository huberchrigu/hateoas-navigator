import {FormField} from './form-field';
import {FormFieldType} from './form-field-type';

export class LinkField extends FormField {
  constructor(name: string | undefined, required: boolean | undefined, readOnly: boolean | undefined, title: string | undefined, private linkedResource: string | undefined) {
    super(name, FormFieldType.LINK, required, readOnly, title);
    if (!linkedResource) {
      throw new Error('Link field "' + name + '" cannot be created, because the linked resource name is missing');
    }
  }

  getLinkedResource(): string {
    return this.linkedResource!;
  }
}
