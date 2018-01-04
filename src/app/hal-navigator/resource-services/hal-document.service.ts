import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import {CollectionAdapter} from '../collection/collection-adapter';
import {NavigationFactory} from '../navigation/navigation-factory';
import {HalResource} from '../hal-resource/hal-resource';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {HeaderOptions} from '@hal-navigator/http/header-options';
import {Cacheable} from '@hal-navigator/cache/cacheable';
import {ItemCacheService} from '@hal-navigator/item/cache/item-cache.service';
import 'rxjs/add/operator/catch';
import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resolver/resource-descriptor-resolver';
import {Api} from '@hal-navigator/resource-services/api';
import {Required, Validate} from '../../decorators/required';

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
    return this.getFromApi<HalResource>('')
      .map(rootHalDocument => new ResourceAdapter('', rootHalDocument, this.descriptorResolver))
      .map(root => new NavigationFactory(root));
  }

  @Validate
  getCollection(@Required resourceName: string): Observable<CollectionAdapter> {
    return this.getFromApi<HalResource>('/' + resourceName)
      .map(collectionHalDocument => new ResourceAdapter(resourceName, collectionHalDocument, this.descriptorResolver))
      .map(resource => new CollectionAdapter(resource));
  }

  @Validate
  deleteResource(@Required document: HalResource, version: string): Observable<HttpResponse<void>> {
    const resourceLink = ResourceLink.fromResourceObject(document, undefined).getRelativeUri();
    return this.deleteFromApi(resourceLink, version)
      .map(response => this.resourceCacheService.removeFromResponse(resourceLink, response));
  }

  @Validate
  create(@Required resourceName: string, object: any): Observable<VersionedResourceAdapter> {
    return this.postToApi('/' + resourceName, object)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response));
  }

  @Validate
  update(@Required resourceName: string, id: string, object: any, version: string): Observable<VersionedResourceAdapter> {
    return this.putToApi('/' + resourceName + '/' + id, object, version)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response));
  }

  @Validate
  getItem(@Required resourceName: string, @Required id: string): Observable<VersionedResourceAdapter> {
    return this.getResponseFromApi<HalResource>(`/${resourceName}/${id}`, this.resourceCacheService.getRequestHeader(resourceName, id))
      .map(response => this.resourceCacheService.getItemFromGetResponse(resourceName, response))
      .catch(response => this.resourceCacheService.getItemFromErroneousGetResponse(resourceName, id, response));
  }

  private getFromApi<T>(resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.getResponseFromApi<T>(resourceUrl, headers).map(response => response.body);
  }

  @Validate
  private getResponseFromApi<T>(@Required resourceUrl: string, headers: HttpHeaders): Observable<HttpResponse<T>> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, HalDocumentService.getOptions(headers));
  }

  private deleteFromApi(resourceUrl: string, version: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(Api.PREFIX + resourceUrl,
      HalDocumentService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }

  private postToApi(resourceUrl: string, object: any): Observable<HttpResponse<HalResource>> {
    return this.httpClient.post<HalResource>(Api.PREFIX + resourceUrl, object, HalDocumentService.getOptions());
  }

  private putToApi(resourceUrl: string, object: any, version: string): Observable<HttpResponse<HalResource>> {
    return this.httpClient.put<HalResource>(Api.PREFIX + resourceUrl, object,
      HalDocumentService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }
}
