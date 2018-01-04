import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';

/**
 * Representation of a JSON property including its value. The property can be of any type: array, object, number or string.
 */
export interface JsonProperty {
  getDisplayValue(): string | number;

  getFormValue(): any;

  getDescriptor(): PropertyDescriptor;

  getName(): string;

  /**
   * If the current property is an object, returns all child properties. Otherwise throws an error.
   */
  getObjectProperties(): JsonProperty[];
}
