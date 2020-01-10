import {JsonValueType} from '.';
import {PropDescriptor} from '..';

/**
 * Describes a property with name and value. The value is of type V.
 */
export interface GenericProperty<V, D extends PropDescriptor> {
  /**
   * The value in a form that can be used in a view.
   */
  getDisplayValue(): string | number;

  /**
   * The value as {@link JsonValueType native JSON type} that can be used as form value.
   */
  getFormValue(): JsonValueType;

  /**
   * {@link PropDescriptor Metadata} about this property. The metadata is completely independent from the actual value.
   */
  getDescriptor(): D;

  getName(): string;

  /**
   * The original raw value.
   */
  getValue(): V;

  hasDescriptor(): boolean;
}
