import {FormFieldBuilder} from '../form/form-field-builder';

/**
 * Describes the schema of a resource or resource property. This interface serves as an abstraction and can be implemented by
 * fetching this information from the backend or by static configuration.
 */
export interface PropertyDescriptor {
  /**
   * This is a title describing the resource or property.
   * @returns <code>undefined</code> if the descriptor does not know the title.
   */
  getTitle(): string;

  /**
   * This is the resource or property name.
   */
  getName(): string;

  /**
   * The child property descriptor. If the current property is an association, the associated resource descriptor's child is returned.
   * @returns <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChildDescriptor(resourceName: string): PropertyDescriptor;

  /**
   * Returns the descriptor of the array items, if this descriptor represents an array.
   */
  getArrayItemsDescriptor(): PropertyDescriptor;

  /**
   * All child descriptors.
   * <b>Important:</b> If this property is an association to another resource, this will return an empty list.
   * @returns <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildrenDescriptors(): Array<PropertyDescriptor>;

  /**
   * Is <code>null</code> if this is no association or <code>undefined</code> if unknown.
   */
  getAssociatedResourceName(): string;

  /**
   * Provides a form field provider, which can be extended by custom configuration.
   */
  toFormFieldBuilder(): FormFieldBuilder;
}
