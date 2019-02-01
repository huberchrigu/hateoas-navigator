import {InjectionToken} from '@angular/core';

export interface ModuleConfiguration {
  itemConfigs: { [resourceName: string]: PropertyConfig };
}

export interface PropertyConfig {
  actionLinks?: { [actionName: string]: PropertyConfig };
  associatedResourceName?: string;
  properties?: { [propertyName: string]: PropertyConfig };
  items?: PropertyConfig;

  title?: string;
  dateTimeType?: DateTimeType;
  enumOptions?: string[]
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');
