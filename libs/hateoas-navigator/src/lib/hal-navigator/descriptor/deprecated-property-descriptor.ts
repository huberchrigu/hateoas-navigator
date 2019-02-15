import {FormFieldBuilder} from '../form/form-field-builder';
import {DeprecatedResourceDescriptor} from './deprecated-resource-descriptor';

export interface PropDescriptor {

  /**
   * This is a title describing the property.
   * @returns <code>undefined</code> if the descriptor does not know the title.
   */
  getTitle(): string;

  /**
   * This is the resource or property name.
   */
  getName(): string;

  /**
   * Provides a form field provider, which can be extended by custom configuration.
   */
  toFormFieldBuilder(): FormFieldBuilder;

  /**
   * Convenience method that returns the function's result, if this descriptor is of the given type.
   * @param fct The function of T
   * @param args The function's arguments
   */
  // orNull<T extends PropDescriptor, R>(fct: (d: T) => R, ...args): R;
}

/**
 * Describes the schema of a resource or resource property. This interface serves as an abstraction and can be implemented by
 * fetching this information from the backend or by static configuration.
 */
// @deprecated
export interface DeprecatedPropertyDescriptor extends PropDescriptor {

  /**
   * The child property descriptor. If the current property is an association, the associated resource descriptor's child is returned.
   * @returns <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChildDescriptor(resourceName: string): DeprecatedResourceDescriptor;

  /**
   * @deprecated
   */
  getChildResourceDesc(childResource: string): DeprecatedResourceDescriptor;

  /**
   * @deprecated
   * Is <code>null</code> if this is no association or <code>undefined</code> if unknown.
   */
  getAssociatedResourceName(): string;

  /**
   * @deprecated
   * All child descriptors.
   * <b>Important:</b> If this property is an association to another resource, this will return an empty list.
   * @returns <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildrenDescriptors(): Array<DeprecatedResourceDescriptor>;

  /**
   * @deprecated
   */
  getArrayItemsDescriptor(): DeprecatedResourceDescriptor;
}

export interface ObjectPropertyDescriptor extends PropDescriptor {
  /**
   * All child descriptors.
   * @returns <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildDescriptors<T extends PropDescriptor>(): Array<T>;

  /**
   * The child property descriptor.
   * @returns <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChildDescriptor<T extends PropDescriptor>(resourceName: string): T;
}

export interface AssociationPropertyDescriptor extends PropDescriptor {
  getAssociatedResourceName(): string;
}

export interface ArrayPropertyDescriptor<T extends PropDescriptor> extends PropDescriptor {
  /**
   * Returns the descriptor of the array items.
   */
  getItemsDescriptor(): T;
}
