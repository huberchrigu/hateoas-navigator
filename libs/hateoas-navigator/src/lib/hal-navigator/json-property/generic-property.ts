import {JsonValueType, PrimitiveValueType} from '.';
import {GenericPropertyDescriptor} from '..';

/**
 * Describes a property with name and value. The value is of type V.
 */
export interface GenericProperty<V, D extends GenericPropertyDescriptor> {
  /**
   * The value in a form that can be used in a view.
   */
  getDisplayValue(): string | number;

  /**
   * The value as {@link JsonValueType native JSON type} that can be used as form value.
   */
  getFormValue(): JsonValueType;

  /**
   * {@link GenericPropertyDescriptor Metadata} about this property.
   * @throws Error If no descriptor was resolved and found (use {@link hasDescriptor} to be sure).
   */
  getDescriptor(): D;

  getName(): string;

  /**
   * The original raw value.
   */
  getValue(): V;

  /**
   * The property has a {@link GenericPropertyDescriptor descriptor} if it was resolved and found.
   */
  hasDescriptor(): boolean;
}

/**
 * An empty property has a null or undefined value. Its descriptor may be of any type.
 */
export interface EmptyProperty<D extends GenericPropertyDescriptor> extends GenericProperty<null | undefined, D> {
}

/**
 * A property with {@link PrimitiveValueType}
 */
export interface PrimitiveProperty extends GenericProperty<PrimitiveValueType, GenericPropertyDescriptor> {
}
