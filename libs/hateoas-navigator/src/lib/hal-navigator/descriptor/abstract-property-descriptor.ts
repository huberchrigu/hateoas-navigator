import {FormFieldBuilder} from '../form/form-field-builder';
import {DeprecatedPropertyDescriptor} from './deprecated-property-descriptor';
import {DeprecatedResourceDescriptor} from './deprecated-resource-descriptor';

export abstract class AbstractPropertyDescriptor implements DeprecatedPropertyDescriptor {
  protected constructor(private name: string) {
  }

  getName(): string {
    return this.name;
  }

  /**
   * Prepares a form field builder with all children's and array items' field builders. Descriptor-dependent configurations can be added
   * in {@link addFormFieldDetails}.
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

  abstract getChildDescriptor(resourceName: string): DeprecatedResourceDescriptor;

  abstract getChildrenDescriptors(): Array<DeprecatedResourceDescriptor>;

  abstract getArrayItemsDescriptor(): DeprecatedResourceDescriptor;

  abstract getAssociatedResourceName(): string;

  protected abstract addFormFieldDetails(formFieldBuilder: FormFieldBuilder);

  abstract getChildResourceDesc(childResource: string): DeprecatedResourceDescriptor;

}
