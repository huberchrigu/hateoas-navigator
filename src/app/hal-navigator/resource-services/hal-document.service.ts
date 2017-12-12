import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import {CollectionAdapter} from '../collection/collection-adapter';
import {NavigationFactory} from '../navigation/navigation-factory';
import {ResourceObject} from '../resource-object/resource-object';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {HeaderOptions} from '@hal-navigator/http/http/header-options';
import {Cacheable} from '@hal-navigator/cache/cacheable';
import {ItemCacheService} from '@hal-navigator/item/cache/item-cache.service';
import 'rxjs/add/operator/catch';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {Api} from '@hal-navigator/resource-services/api';

/**
 * This is the module's core service providing functionality to access HAL, ALPS and JsonSchema documents.
 */
@Injectable()
export class HalDocumentService {
  private static getOptions(headers?: HttpHeaders): { headers: HttpHeaders, observe: 'response' } {
    return {
      headers: headers,
      observe: 'response'
    };
  }

  constructor(private httpClient: HttpClient, private resourceCacheService: ItemCacheService,
              @Inject(MODULE_CONFIG) private moduleConfig: ModuleConfiguration,
              private descriptorResolver: ResourceDescriptorResolver) {
  }

  @Cacheable()
  getRootNavigation(): Observable<NavigationFactory> {
    return this.getFromApi<ResourceObject>('')
      .map(rootHalDocument => new ResourceObjectAdapter(rootHalDocument, this.descriptorResolver))
      .map(root => new NavigationFactory(root));
  }

  getCollection(resourceName: string): Observable<CollectionAdapter> {
    return this.getFromApi<ResourceObject>('/' + resourceName)
      .map(collectionHalDocument => new ResourceObjectAdapter(collectionHalDocument, this.descriptorResolver))
      .map(resource => new CollectionAdapter(resource));
  }

  deleteResource(document: ResourceObject, version: string): Observable<HttpResponse<void>> {
    const resourceLink = ResourceLink.fromResourceObject(document, undefined).getRelativeUri();
    return this.deleteFromApi(resourceLink, version)
      .map(response => this.resourceCacheService.removeFromResponse(resourceLink, response));
  }

  create(resourceName: string, object: any): Observable<VersionedResourceObject> {
    return this.postToApi('/' + resourceName, object)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(response));
  }

  update(resourceName: string, id: string, object: any, version: string): Observable<VersionedResourceObject> {
    return this.putToApi('/' + resourceName + '/' + id, object, version)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(response));
  }

  getItem(resource: string, id: string): Observable<VersionedResourceObject> {
    return this.getResponseFromApi<ResourceObject>(`/${resource}/${id}`, this.resourceCacheService.getRequestHeader(resource, id))
      .map(response => this.resourceCacheService.getItemFromGetResponse(response))
      .catch(response => this.resourceCacheService.getItemFromErroneousGetResponse(resource, id, response));
  }

  private getFromApi<T>(resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.getResponseFromApi<T>(resourceUrl, headers).map(response => response.body);
  }

  private getResponseFromApi<T>(resourceUrl: string, headers: HttpHeaders): Observable<HttpResponse<T>> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, HalDocumentService.getOptions(headers));
  }

  private deleteFromApi(resourceUrl: string, version: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(Api.PREFIX + resourceUrl,
      HalDocumentService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }

  private postToApi(resourceUrl: string, object: any): Observable<HttpResponse<ResourceObject>> {
    return this.httpClient.post<ResourceObject>(Api.PREFIX + resourceUrl, object, HalDocumentService.getOptions());
  }

  private putToApi(resourceUrl: string, object: any, version: string): Observable<HttpResponse<ResourceObject>> {
    return this.httpClient.put<ResourceObject>(Api.PREFIX + resourceUrl, object,
      HalDocumentService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }
}
