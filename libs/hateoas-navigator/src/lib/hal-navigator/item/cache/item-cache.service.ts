import {throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {VersionedResourceAdapter} from '../versioned-resource-adapter';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HalResourceObject} from '../../hal-resource/value-type/hal-value-type';
import {Observable, ObservableInput, of} from 'rxjs';
import {HeaderOptions} from '../../http/header-options';
import {ResourceLink} from '../../link-object/resource-link';
import {ResourceAdapterFactoryService} from 'hateoas-navigator/hal-navigator/hal-resource/resource-adapter-factory.service';
import {VersionedJsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
@Injectable()
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';
  private cache: { [key: string]: VersionedJsonResourceObject } = {};

  constructor(private resourceAdapterFactoryService: ResourceAdapterFactoryService) {
  }

  getItemFromModifyingResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedJsonResourceObject {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromGetResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedJsonResourceObject {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string,
                                  response: HttpResponse<HalResourceObject>): ObservableInput<VersionedResourceAdapter> {
    if (response.status === 304) {
      return this.handleNotModifiedResponse(resource, id);
    }
    return observableThrowError(response);
  }

  removeFromResponse<T>(resourceLink: string, response: HttpResponse<T>): HttpResponse<T> {
    this.removeFromCache(resourceLink);
    return response;
  }

  getRequestHeader(resource: string, id: string): HttpHeaders {
    const item = this.getFromCache(resource, id);
    const version = item ? item.getVersion() : '"unknown"';
    return HeaderOptions.withIfNoneMatchHeader(version);
  }

  private handleOkResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedJsonResourceObject {
    const version = response.headers.get(ItemCacheService.E_TAG_HEADER);
    const resourceObject = response.body;
    const item = this.resourceAdapterFactoryService.createWithVersion(resourceName, resourceObject, null, version);
    if (version && item) {
      this.addToCache(item);
    }
    return item;
  }

  private handleNotModifiedResponse(resource: string, id: string): Observable<VersionedJsonResourceObject> {
    const cachedObject = this.getFromCache(resource, id);
    if (cachedObject) {
      return of(cachedObject);
    } else {
      return observableThrowError('There is no resource ' + resource + ' with ID ' + id);
    }
  }

  private addToCache(item: VersionedJsonResourceObject): void {
    this.cache[item.getSelfLink().getRelativeUri()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): VersionedJsonResourceObject {
    return this.cache[ResourceLink.relativeUriFromId(resource, id)];
  }
}
