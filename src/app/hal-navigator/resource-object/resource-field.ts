import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {JsonType} from '@hal-navigator/resource-object/resource-object';

export interface ResourceField {
  getDisplayValue(): string | number;

  getFormValue(): any;

  getDescriptor(): ResourceDescriptor; // TODO: Naming: ResourceField/Resource/Property

  /**
   * @deprecated
   */
  isUriType(): boolean;
}
