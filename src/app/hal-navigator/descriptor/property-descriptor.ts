import {Observable} from 'rxjs/Observable';
import {FormField} from '@hal-navigator/form/form-field';

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
   * @param {string} resourceName
   * @returns {PropertyDescriptor} <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChild(resourceName: string): PropertyDescriptor;

  /**
   * All child descriptors.
   * <b>Important:</b> If this property is an association to another resource, this will return an empty list. In this
   * case, use {@link #getAssociatedResource()}.
   * @returns {Array<PropertyDescriptor>} <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildren(): Array<PropertyDescriptor>;

  resolveAssociation(): Observable<PropertyDescriptor>;
  getAssociatedResource(): PropertyDescriptor;

  toFormField(): FormField;
}
