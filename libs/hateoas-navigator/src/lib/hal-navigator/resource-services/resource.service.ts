import {map, catchError} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';

import {CollectionAdapter} from '../collection/collection-adapter';
import {NavigationFactory} from '../navigation/navigation-factory';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Required, Validate} from '../../decorators/required';
import {ItemCacheService} from '../item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from '../config';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {Cacheable} from '../cache/cacheable';
import {Observable} from 'rxjs';
import {Api} from './api';
import {HeaderOptions} from '../http/header-options';
import {ResourceLink} from '../link-object/resource-link';
import {ResourceAdapterFactoryService} from '../hal-resource/resource-adapter-factory.service';
import {VersionedJsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';

/**
 * This is the module's core service providing functionality to access resources (only HAL documents supported yet).
 */
@Injectable()
export class ResourceService {
  private static getOptions(headers?: HttpHeaders): { headers: HttpHeaders, observe: 'response' } {
    return {
      headers: headers,
      observe: 'response'
    };
  }

  constructor(private httpClient: HttpClient, private resourceCacheService: ItemCacheService,
              @Inject(MODULE_CONFIG) private moduleConfig: ModuleConfiguration,
              private descriptorResolver: ResourceDescriptorProvider,
              private resourceFactory: ResourceAdapterFactoryService) {
  }

  @Cacheable()
  getRootNavigation(): Observable<NavigationFactory> {
    return this.getFromApi<HalResourceObject>('').pipe(
      map(rootHalDocument => this.resourceFactory.create('', rootHalDocument, undefined)),
      map(root => new NavigationFactory(root)));
  }

  @Validate
  getCollection(@Required resourceName: string): Observable<CollectionAdapter> {
    return this.getFromApi<HalResourceObject>('/' + resourceName).pipe(
      map(collectionHalDocument => this.resourceFactory.create(resourceName, collectionHalDocument, undefined)),
      map(resource => new CollectionAdapter(this.resourceFactory, resource)));
  }

  @Validate
  deleteResource(@Required document: HalResourceObject, version: string): Observable<HttpResponse<void>> {
    const resourceLink = ResourceLink.fromResourceObject(document, undefined).getRelativeUri();
    return this.removeFromBackendAndCache(resourceLink, version);
  }

  @Validate
  create(@Required resourceName: string, object: any): Observable<VersionedJsonResourceObject> {
    return this.createAndCache(resourceName, '/' + resourceName, object);
  }

  @Validate
  update(@Required resourceName: string, id: string, object: any, version: string): Observable<VersionedJsonResourceObject> {
    return this.updateItemAndCachedVersion(resourceName, '/' + resourceName + '/' + id, object, version);
  }

  @Validate
  getItem(@Required resourceName: string, @Required id: string): Observable<VersionedJsonResourceObject> {
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
  executeCustomAction(@Required uri: string, @Required actionOn: VersionedJsonResourceObject, @Required method: string, body: object):
    Observable<VersionedJsonResourceObject> {
    const version = actionOn.getVersion();
    const name = actionOn.getName();

    switch (method) {
      case 'POST':
        return this.createAndCache(name, uri, body);
      case 'PUT':
        return this.updateItemAndCachedVersion(name, uri, body, version);
      case 'GET':
        return this.getItemFromResourceOrCache(name, uri, ResourceLink.extractIdFromUri(name, uri));
      case 'DELETE':
        return this.removeFromBackendAndCache(uri, version).pipe(map(() => actionOn)); // TODO: DELETE responses are always ignored yet
      default:
        throw new Error(method + ' not supported');
    }
  }

  private createAndCache(resourceName: string, resourceUri: string, object: any) {
    return this.postToApi(resourceUri, object).pipe(
      map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response)));
  }

  private removeFromBackendAndCache(resourceLink, version: string) {
    return this.deleteFromApi(resourceLink, version).pipe(
      map(response => this.resourceCacheService.removeFromResponse(resourceLink, response)));
  }

  private updateItemAndCachedVersion(resourceName: string, resourceUri: string, object: any, version: string) {
    return this.putToApi(resourceUri, object, version).pipe(
      map(response => this.resourceCacheService.getItemFromModifyingResponse(resourceName, response)));
  }

  private getItemFromResourceOrCache(resourceName: string, resourceUri: string, id: string) {
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

  private putToApi(resourceUrl: string, object: any, version: string): Observable<HttpResponse<HalResourceObject>> {
    return this.httpClient.put<HalResourceObject>(Api.PREFIX + resourceUrl, object,
      ResourceService.getOptions(HeaderOptions.withIfMatchHeader(version)));
  }
}
