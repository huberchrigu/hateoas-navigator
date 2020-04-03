import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {CollectionAdapter} from '../collection/collection-adapter';
import {NavigationFactory} from '../navigation/navigation-factory';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {Required, Validate} from '../../decorators/required';
import {ItemCacheService} from '../item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from '../config';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {Cacheable} from '../cache/cacheable';
import {Api} from './api';
import {HeaderOptions} from '../http/header-options';
import {ResourceLink} from '../link-object/resource-link';
import {ResourceObjectPropertyFactoryService} from '../hal-resource/resource-object-property-factory.service';
import {VersionedResourceObjectProperty} from '../hal-resource/resource-object-property';
import {CurrentUserProvider} from './current-user-provider';
import {GetCollectionFallback} from './get-collection-fallback';

/**
 * This is the module's core service providing functionality to access resources (only HAL documents supported yet).
 */
@Injectable()
export class ResourceService {

  private static getOptions(headers?: HttpHeaders): { headers: HttpHeaders, observe: 'response' } {
    return {
      headers,
      observe: 'response'
    };
  }

  constructor(private httpClient: HttpClient, private resourceCacheService: ItemCacheService,
              @Inject(MODULE_CONFIG) private moduleConfig: ModuleConfiguration,
              private descriptorResolver: ResourceDescriptorProvider,
              private resourceFactory: ResourceObjectPropertyFactoryService,
              @Optional() private currentUserProvider?: CurrentUserProvider) {
  }

  @Cacheable()
  getRootNavigation(): Observable<NavigationFactory> {
    return this.getFromApi<HalResourceObject>('').pipe(
      map(rootHalDocument => this.resourceFactory.create('', rootHalDocument, undefined)),
      map(root => new NavigationFactory(root)));
  }

  @Validate
  getCollection(@Required resourceName: string): Observable<CollectionAdapter> {
    const fallback = new GetCollectionFallback(resourceName, this.moduleConfig,
      uri => this.getCustomCollection(resourceName, uri), this.currentUserProvider);
    return this.getCustomCollection(resourceName, '/' + resourceName, fallback);
  }

  @Validate
  getCustomCollection(@Required resourceName: string, @Required uri: string,
                      fallback?: GetCollectionFallback): Observable<CollectionAdapter> {
    const headers = fallback ? fallback.getFallbackHeaders() : undefined;
    const response = this.getFromApi<HalResourceObject>(uri, headers).pipe(
      map(collectionHalDocument => this.resourceFactory.create(resourceName, collectionHalDocument, undefined)),
      map(resource => new CollectionAdapter(this.resourceFactory, resource)));
    return fallback ? response.pipe(catchError(r => fallback.handleError(r))) : response;
  }

  @Validate
  deleteResource(@Required document: HalResourceObject, version: string): Observable<HttpResponse<void>> {
    const resourceLink = ResourceLink.fromResourceObject(document, undefined).toRelativeLink();
    return this.removeFromBackendAndCache(resourceLink.getUri(), version);
  }

  @Validate
  create(@Required resourceName: string, object: any): Observable<VersionedResourceObjectProperty> {
    return this.createAndCache(resourceName, '/' + resourceName, object);
  }

  @Validate
  update(@Required resourceName: string, id: string, object: any, version: string): Observable<VersionedResourceObjectProperty> {
    return this.updateItemAndCachedVersion(resourceName, '/' + resourceName + '/' + id, object, version,
      this.moduleConfig.updateMethod === 'PATCH');
  }

  @Validate
  getItem(@Required resourceName: string, @Required id: string): Observable<VersionedResourceObjectProperty> {
    return this.getItemFromResourceOrCache(resourceName, `/${resourceName}/${id}`, id);
  }

  @Cacheable()
  @Validate
  getOptionsForCustomUri(@Required uri: string): Observable<string[]> {
    return this.httpClient.options(Api.PREFIX + uri, {observe: 'response'}).pipe(
      map(response => response.headers.get('Allow').split(','))
    );
  }

  @Validate
  executeCustomAction(@Required uri: string, @Required actionOn: VersionedResourceObjectProperty, @Required method: string, body: object):
    Observable<VersionedResourceObjectProperty> {
    const version = actionOn.getVersion();
    const name = actionOn.getName();

    return this.putToApi(uri, body, version, method).pipe(
      map(response => {
        const responseBody = response.body;
        if (responseBody) {
          return this.resourceCacheService.getItemFromModifyingResponse(name, response);
        } else {
          throw new Error('Custom action needs to return body - otherwise state cannot be known');
        }
      })
    );
  }

  private createAndCache(resourceName: string, resourceUri: string, object: any) {
    return this.postToApi(resourceUri, object).pipe(
      map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response)));
  }

  private removeFromBackendAndCache(resourceLink: string, version: string): Observable<HttpResponse<any>> {
    return this.deleteFromApi(resourceLink, version).pipe(
      map(response => this.resourceCacheService.removeFromResponse(resourceLink, response))
    );
  }

  private updateItemAndCachedVersion(resourceName: string, resourceUri: string, object: any, version: string, usePatch = false) {
    return this.putToApi(resourceUri, object, version, usePatch ? 'patch' : 'put').pipe(
      map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response)));
  }

  private getItemFromResourceOrCache(resourceName: string, resourceUri: string, id: string): Observable<VersionedResourceObjectProperty> {
    return this.getResponseFromApi<HalResourceObject>(resourceUri, this.resourceCacheService.getRequestHeader(resourceName, id))
      .pipe(
        map(response => this.resourceCacheService.getItemFromGetResponse(resourceName, response)),
        catchError(response => this.resourceCacheService.getItemFromErroneousGetResponse(resourceName, id, response)));
  }

  private getFromApi<T>(resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.getResponseFromApi<T>(resourceUrl, headers).pipe(map(response => response.body));
  }

  @Validate
  private getResponseFromApi<T>(@Required resourceUrl: string, headers: HttpHeaders): Observable<HttpResponse<T>> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, ResourceService.getOptions(headers));
  }

  private deleteFromApi(resourceUrl: string, version: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(Api.PREFIX + resourceUrl,
      ResourceService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }

  private postToApi(resourceUrl: string, object: any): Observable<HttpResponse<HalResourceObject>> {
    return this.httpClient.post<HalResourceObject>(Api.PREFIX + resourceUrl, object, ResourceService.getOptions());
  }

  private putToApi(resourceUrl: string, object: any, version: string, method: string): Observable<HttpResponse<HalResourceObject>> {
    return this.httpClient.request<HalResourceObject>(method, Api.PREFIX + resourceUrl, {
      body: object,
      ...ResourceService.getOptions(HeaderOptions.withIfMatchHeader(version))
    });
  }
}
