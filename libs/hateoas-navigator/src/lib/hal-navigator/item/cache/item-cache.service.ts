import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HalResourceObject} from '../../hal-resource';
import {Observable, ObservableInput, of} from 'rxjs';
import {HeaderOptions} from '../../http/header-options';
import {ResourceLink} from '../../link-object';
import {ResourceObjectPropertyFactoryService} from '../../hal-resource';
import {VersionedResourceObjectProperty} from '../../hal-resource';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
@Injectable()
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';
  private cache: { [key: string]: VersionedResourceObjectProperty | undefined } = {};

  constructor(private resourceAdapterFactoryService: ResourceObjectPropertyFactoryService) {
  }

  getItemFromModifyingResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedResourceObjectProperty {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromGetResponse(resourceName: string, response: HttpResponse<HalResourceObject>): VersionedResourceObjectProperty {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string,
                                  response: HttpResponse<HalResourceObject>): ObservableInput<VersionedResourceObjectProperty> {
    if (response.status === 304) {
      return this.handleNotModifiedResponse(resource, id);
    }
    return throwError(() => new Error('Received error response: ' + response.status));
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
      return throwError(() => new Error('There is no resource ' + resource + ' with ID ' + id));
    }
  }

  private addToCache(item: VersionedResourceObjectProperty): void {
    this.cache[item.getSelfLink().toRelativeLink().getUri()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): VersionedResourceObjectProperty | undefined {
    return this.cache[ResourceLink.linkFromId(resource, id).getUri()];
  }
}
