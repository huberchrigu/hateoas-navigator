import {InjectionToken} from '@angular/core';

export interface ModuleConfiguration {
  itemDescriptors: { [item: string]: ItemDescriptor };
}

export interface ItemDescriptor {
  [property: string]: any | ItemDescriptor;

  dateTimeType?: DateTimeType;
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');
