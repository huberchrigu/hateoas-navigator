import {InjectionToken} from '@angular/core';
import {FormFieldType} from '../form/form-field-type';

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
  isArrayOfAssociations?: boolean;
  actionLinks?: { [actionName: string]: PropertyConfig };
  associatedResourceName?: string;
  properties?: { [propertyName: string]: PropertyConfig };
  items?: PropertyConfig;

  /**
   * Additional configuration of search queries. Per Default, a resource's search query has the URL /[resourceName]/search/[queryName]
   */
  queries?: { [queryName: string]: QueryConfig };

  /**
   * A search query URL that is used to fetch items, if fetching all items gives an 401 UNAUTHORIZED error.
   * Per Default, the flow is as follows:
   * <ol>
   *   <li>/[resourceName] return 401 UNAUTHORIZED</li>
   *   <li>If this configuration is set, /[resourceName]/search/[unauthorizedFallback] is called to get a subset of items</li>
   * </ol>
   *
   * <i>Example</i>: A query like "findAllUnprotected" could return all items available to anonymous users.
   */
  unauthorizedFallback?: string;
  /**
   * Like the {@link unauthorizedFallback} method, but for 403 PERMISSION DENIED responses.
   *
   * If a {@link CurrentUserProvider} is available, you can use a <code>{userId}</code> placeholder in your configuration
   * that will be replaced by the current user's id.
   *
   * <i>Example</i>: A query like "findByCreatedBy?createdBy={userId}" will find all items that were created by the current user.
   */
  permissionDeniedFallback?: string;
}

export enum DateTimeType {DATE, DATE_TIME, TIME}

export const MODULE_CONFIG = new InjectionToken('moduleConfig');

export interface QueryConfig {
  title?: string;
  params?: { [paramName: string]: FormFieldSupport };
}
