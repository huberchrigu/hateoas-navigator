import {throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {VersionedResourceObjectPropertyImpl} from '../versioned-resource-object-property-impl';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HalResourceObject} from '../../hal-resource/value-type/hal-value-type';
import {Observable, ObservableInput, of} from 'rxjs';
import {HeaderOptions} from '../../http/header-options';
import {ResourceLink} from '../../link-object/resource-link';
import {ResourceObjectPropertyFactoryService} from '../../hal-resource/resource-object-property-factory.service';
import {VersionedResourceObjectProperty} from '../../hal-resource/resource-object-property';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
@Injectable()
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';
  private cache: { [key: string]: VersionedResourceObjectProperty } = {};

  constructor(private resourceAdapterFactoryService: ResourceObjectPropertyFactoryService) {
  }

  getItemFromModifyingResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedResourceObjectProperty {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromGetResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedResourceObjectProperty {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string,
                                  response: HttpResponse<HalResourceObject>): ObservableInput<VersionedResourceObjectPropertyImpl> {
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

  private handleOkResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedResourceObjectProperty {
    const version = response.headers.get(ItemCacheService.E_TAG_HEADER);
    const resourceObject = response.body;
    const item = this.resourceAdapterFactoryService.createWithVersion(resourceName, resourceObject, null, version);
    if (version && item) {
      this.addToCache(item);
    }
    return item;
  }

  private handleNotModifiedResponse(resource: string, id: string): Observable<VersionedResourceObjectProperty> {
    const cachedObject = this.getFromCache(resource, id);
    if (cachedObject) {
      return of(cachedObject);
    } else {
      return observableThrowError('There is no resource ' + resource + ' with ID ' + id);
    }
  }

  private addToCache(item: VersionedResourceObjectProperty): void {
    this.cache[item.getSelfLink().toRelativeLink().getUri()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): VersionedResourceObjectProperty {
    return this.cache[ResourceLink.linkFromId(resource, id).getUri()];
  }
}
