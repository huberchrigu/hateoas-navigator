import {AbstractPropDescriptor} from '../../generic-property-descriptor';
import {FormFieldBuilder} from '../../../form';
import {FieldProcessor} from './field-processor';

export class PropertyDescriptorImpl extends AbstractPropDescriptor {
  /**
   *
   * @param name An array item does not necessarily require a name. All other descriptors do.
   * @param title May be undefined.
   * @param fieldProcessor Must not be null/undefined
   */
  constructor(private name: string | null | undefined, private title: string | undefined, private fieldProcessor: FieldProcessor) {
    super();
  }

  getName(): string {
    return this.name!;
  }

  getTitle(): string {
    return this.title!;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.fieldProcessor(new FormFieldBuilder(this.getName()));
  }
}
