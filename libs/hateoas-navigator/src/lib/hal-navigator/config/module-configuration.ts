import {InjectionToken} from '@angular/core';
import {FormFieldType} from 'hateoas-navigator/hal-navigator';

export interface ModuleConfiguration {
  /**
   * Default method is PUT. But since Spring Data Rest 2.5.7, associations are not updated with PUT anymore (DATAREST-1001).
   */
  updateMethod?: 'PATCH' | 'PUT';
  itemConfigs: { [resourceName: string]: PropertyConfig };
}

export interface FormFieldSupport {
  title?: string;
  type?: FormFieldType;
  dateTimeType?: DateTimeType;
  enumOptions?: string[];
}

export interface PropertyConfig extends FormFieldSupport {
  actionLinks?: { [actionName: string]: PropertyConfig };
  associatedResourceName?: string;
  properties?: { [propertyName: string]: PropertyConfig };
  items?: PropertyConfig;

  queries?: { [queryName: string]: QueryConfig };
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');

export interface QueryConfig {
  title?: string;
  params?: { [paramName: string]: FormFieldSupport };
}
