import {FormFieldType} from './form-field-type';
import {NotNull} from '../../decorators/not-null';

export class FormField {
  constructor(private name: string, private type: FormFieldType, private required: boolean, private readOnly: boolean,
              private title: string) {
    if (!this.type) {
      throw new Error('Cannot create form field ' + name + ' without type');
    }
  }

  @NotNull()
  getName(): string {
    return this.name;
  }

  getType(): FormFieldType {
    return this.type;
  }

  isRequired(): boolean {
    return this.required;
  }

  isReadOnly(): boolean {
    return this.readOnly;
  }

  getTitle(): string {
    return this.title;
  }
}
