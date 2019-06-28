import {InjectionToken} from '@angular/core';

export interface ModuleConfiguration {
  /**
   * Default method is PUT. But since Spring Data Rest 2.5.7, associations are not updated with PUT anymore (DATAREST-1001).
   */
  updateMethod?: 'PATCH' | 'PUT';
  itemConfigs: { [resourceName: string]: PropertyConfig };
}

export interface PropertyConfig {
  actionLinks?: { [actionName: string]: PropertyConfig };
  associatedResourceName?: string;
  properties?: { [propertyName: string]: PropertyConfig };
  items?: PropertyConfig;

  title?: string;
  dateTimeType?: DateTimeType;
  enumOptions?: string[];
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');
