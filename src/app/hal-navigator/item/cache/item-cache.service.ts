import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {HeaderOptions} from '@hal-navigator/http/http/header-options';
import {Observable, ObservableInput} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {DeprecatedLinkFactory} from '@hal-navigator/link-object/link-factory';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';

/**
 * Caches the returned items and saves them together with the <code>ETag</code>. The next time this resource is requested,
 * a 304 Not Modified response can be handled by returning the cached object instead.
 */
export class ItemCacheService {
  private static E_TAG_HEADER = 'ETag';

  private linkFactory = new DeprecatedLinkFactory();
  private cache: { [key: string]: ItemAdapter } = {};

  getItemFromModifyingResponse(response: HttpResponse<ResourceObject>): ItemAdapter {
    return this.handleOkResponse(response);
  }

  getItemFromGetResponse(response: HttpResponse<ResourceObject>): ItemAdapter {
    return this.handleOkResponse(response);
  }

  getItemFromErroneousGetResponse(resource: string, id: string, response: HttpResponse<ResourceObject>): ObservableInput<ItemAdapter> {
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

  private handleOkResponse(response: HttpResponse<ResourceObject>): ItemAdapter {
    const version = response.headers.get(ItemCacheService.E_TAG_HEADER);
    const resourceObject = new ResourceObjectAdapter(response.body);
    const item = new ItemAdapter(resourceObject, version);
    if (version && item) {
      this.addToCache(item);
    }
    return item;
  }

  private handleNotModifiedResponse(resource: string, id: string): Observable<ItemAdapter> {
    const cachedObject = this.getFromCache(resource, id);
    if (cachedObject) {
      return Observable.of(cachedObject);
    } else {
      return Observable.throw('There is no resource ' + resource + ' with ID ' + id);
    }
  }

  private addToCache(item: ItemAdapter): void {
    this.cache[item.getDetailLink()] = item;
  }

  private removeFromCache(resourceLink: string): void {
    this.cache[resourceLink] = undefined;
  }

  private getFromCache(resource: string, id: string): ItemAdapter {
    return this.cache[this.linkFactory.fromId(resource, id)];
  }
}
