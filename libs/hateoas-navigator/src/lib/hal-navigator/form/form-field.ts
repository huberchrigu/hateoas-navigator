import {FormFieldType} from './form-field-type';
import {NotNull} from '../../decorators/not-null';

export class FormField {
  constructor(private name: string | undefined, private type: FormFieldType | undefined, private required: boolean | undefined, private readOnly: boolean | undefined,
              private title: string | undefined) {
    if (!this.type) {
      throw new Error('Cannot create form field ' + name + ' without type');
    }
  }

  @NotNull()
  getName(): string | undefined {
    return this.name;
  }

  getType(): FormFieldType {
    return this.type!;
  }

  isRequired(): boolean {
    return this.required!
  }

  isReadOnly(): boolean | undefined {
    return this.readOnly;
  }

  getTitle(): string {
    return this.title!;
  }
}
