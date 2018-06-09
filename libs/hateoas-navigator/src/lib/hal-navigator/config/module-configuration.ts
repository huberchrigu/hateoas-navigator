import {InjectionToken} from '@angular/core';

export interface ModuleConfiguration {
  itemConfigs: { [resourceName: string]: PropertyConfig };
}

export interface PropertyConfig {
  associatedResourceName?: string;
  properties?: { [propertyName: string]: PropertyConfig };
  items?: PropertyConfig;

  title?: string;
  dateTimeType?: DateTimeType;
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');
