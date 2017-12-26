import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {HeaderOptions} from '@hal-navigator/http/header-options';
import {Observable, ObservableInput} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {Injectable} from '@angular/core';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
@Injectable()
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';
  private cache: { [key: string]: VersionedResourceObject } = {};

  constructor(private descriptorResolver: ResourceDescriptorResolver) {
  }

  getItemFromModifyingResponse(response: HttpResponse<ResourceObject>): VersionedResourceObject {
    return this.handleOkResponse(response);
  }

  getItemFromGetResponse(response: HttpResponse<ResourceObject>): VersionedResourceObject {
    return this.handleOkResponse(response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string,
                                  response: HttpResponse<ResourceObject>): ObservableInput<VersionedResourceObject> {
    if (response.status === 304) {
      return this.handleNotModifiedResponse(resource, id);
    }
    return Observable.throw(response);
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

  private handleOkResponse(response: HttpResponse<ResourceObject>): VersionedResourceObject {
    const version = response.headers.get(ItemCacheService.E_TAG_HEADER);
    const resourceObject = response.body;
    const item = new VersionedResourceObject(resourceObject, version, this.descriptorResolver);
    if (version && item) {
      this.addToCache(item);
    }
    return item;
  }

  private handleNotModifiedResponse(resource: string, id: string): Observable<VersionedResourceObject> {
    const cachedObject = this.getFromCache(resource, id);
    if (cachedObject) {
      return Observable.of(cachedObject);
    } else {
      return Observable.throw('There is no resource ' + resource + ' with ID ' + id);
    }
  }

  private addToCache(item: VersionedResourceObject): void {
    this.cache[item.getSelfLink().getRelativeUri()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): VersionedResourceObject {
    return this.cache[ResourceLink.relativeUriFromId(resource, id)];
  }
}
