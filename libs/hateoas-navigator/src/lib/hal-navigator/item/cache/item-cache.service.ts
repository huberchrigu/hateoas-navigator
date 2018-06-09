
import {throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {VersionedResourceAdapter} from '../versioned-resource-adapter';
import {ResourceDescriptorProvider} from '../../descriptor/provider/resource-descriptor-provider';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {HalResource} from '../../hal-resource/hal-resource';
import {Observable, ObservableInput, of} from 'rxjs/index';
import {HeaderOptions} from '../../http/header-options';
import {ResourceLink} from '../../link-object/resource-link';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
@Injectable()
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';
  private cache: { [key: string]: VersionedResourceAdapter } = {};

  constructor(private descriptorResolver: ResourceDescriptorProvider) {
  }

  getItemFromModifyingResponse(resourceName: string, response: HttpResponse<HalResource>): VersionedResourceAdapter {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromGetResponse(resourceName: string, response: HttpResponse<HalResource>): VersionedResourceAdapter {
    return this.handleOkResponse(resourceName, response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string,
                                  response: HttpResponse<HalResource>): ObservableInput<VersionedResourceAdapter> {
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

  private handleOkResponse(resourceName: string, response: HttpResponse<HalResource>): VersionedResourceAdapter {
    const version = response.headers.get(ItemCacheService.E_TAG_HEADER);
    const resourceObject = response.body;
    const item = new VersionedResourceAdapter(resourceName, resourceObject, version, this.descriptorResolver);
    if (version && item) {
      this.addToCache(item);
    }
    return item;
  }

  private handleNotModifiedResponse(resource: string, id: string): Observable<VersionedResourceAdapter> {
    const cachedObject = this.getFromCache(resource, id);
    if (cachedObject) {
      return of(cachedObject);
    } else {
      return observableThrowError('There is no resource ' + resource + ' with ID ' + id);
    }
  }

  private addToCache(item: VersionedResourceAdapter): void {
    this.cache[item.getSelfLink().getRelativeUri()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): VersionedResourceAdapter {
    return this.cache[ResourceLink.relativeUriFromId(resource, id)];
  }
}
