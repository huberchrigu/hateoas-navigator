import {FormFieldBuilder} from '../form/form-field-builder';
import {PropertyDescriptor} from './property-descriptor';

export abstract class AbstractPropertyDescriptor implements PropertyDescriptor {
  protected constructor(private name: string) {
  }

  getName(): string {
    return this.name;
  }

  /**
   * Prepares a form field builder with all children's and array items' field builders. Descriptor-dependent configurations can be added
   * in {@link #addFormDeatils()}.
   */
  toFormFieldBuilder(): FormFieldBuilder {
    const builder = new FormFieldBuilder(this.getName())
      .withSubFields(this.getChildrenDescriptors().map(d => d.toFormFieldBuilder()));

    const arrayItem = this.getArrayItemsDescriptor();
    if (arrayItem) {
      builder.withArraySpecProvider(() => arrayItem.toFormFieldBuilder());
    }
    this.addFormFieldDetails(builder);
    return builder;
  }

  abstract getTitle(): string;

  abstract getChildDescriptor(resourceName: string): PropertyDescriptor;

  abstract getChildrenDescriptors(): Array<PropertyDescriptor>;

  abstract getArrayItemsDescriptor(): PropertyDescriptor;

  abstract getAssociatedResourceName(): string;

  protected abstract addFormFieldDetails(formFieldBuilder: FormFieldBuilder);

}
