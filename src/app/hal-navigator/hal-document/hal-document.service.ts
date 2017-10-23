import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CollectionAdapter} from '../collection/collection-adapter';
import {NavigationFactory} from '../navigation/navigation-adapter';
import {ResourceObject} from '../resource-object/resource-object';
import {DeprecatedLinkFactory} from '../link-object/link-factory';
import {SchemaAdapter} from '../schema/schema-adapter';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {HeaderOptions} from '@hal-navigator/http/http/header-options';
import {Cacheable} from '@hal-navigator/cache/cacheable';
import {ItemCacheService} from '@hal-navigator/item/cache/item-cache.service';
import 'rxjs/add/operator/catch';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

@Injectable()
export class HalDocumentService {
  private static readonly API_PREFIX = '/api';

  private linkFactory = new DeprecatedLinkFactory();

  constructor(private http: Http, private resourceCacheService: ItemCacheService) {
  }

  @Cacheable()
  getRootNavigation(): Observable<NavigationFactory> {
    return this.getFromApi<ResourceObject>('')
      .map(rootHalDocument => new ResourceObjectAdapter(rootHalDocument))
      .map(root => new NavigationFactory(root));
  }

  getCollection(resourceName: string): Observable<CollectionAdapter> {
    return this.getFromApi<ResourceObject>('/' + resourceName)
      .map(collectionHalDocument => new ResourceObjectAdapter(collectionHalDocument))
      .map(resource => new CollectionAdapter(resource));
  }

  deleteResource(document: ResourceObject, version: string): Observable<Response> {
    const resourceLink = this.linkFactory.fromDocument(document);
    return this.deleteFromApi(resourceLink, version)
      .map(response => this.resourceCacheService.removeFromResponse(resourceLink, response));
  }

  create(resourceName: string, object: any): Observable<ItemAdapter> {
    return this.postToApi('/' + resourceName, object)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(response));
  }

  update(resourceName: string, id: string, object: any, version: string): Observable<ItemAdapter> {
    return this.putToApi('/' + resourceName + '/' + id, object, version)
      .map(response => this.resourceCacheService.getItemFromModifyingResponse(response));
  }

  getItem(resource: string, id: string): Observable<ItemAdapter> {
    return this.getResponseFromApi(`/${resource}/${id}`, this.resourceCacheService.getRequestHeader(resource, id))
      .map(response => this.resourceCacheService.getItemFromGetResponse(response))
      .catch(response => this.resourceCacheService.getItemFromErroneousGetResponse(resource, id, response));
  }

  @Cacheable()
  getSchema(resourceName: string): Observable<SchemaAdapter> {
    return this.getFromApi<JsonSchema>('/profile/' + resourceName, HeaderOptions.withAcceptHeader('application/schema+json'))
      .map(schema => new SchemaAdapter(schema));
  }

  private getFromApi<T>(resourceUrl: string, customArgs?: RequestOptionsArgs): Observable<T> {
    return this.getResponseFromApi(resourceUrl, customArgs).map(response => response.json());
  }

  private getResponseFromApi(resourceUrl: string, customArgs?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(HalDocumentService.API_PREFIX + resourceUrl, customArgs);
  }

  private deleteFromApi(resourceUrl: string, version: string): Observable<Response> {
    return this.http.delete(HalDocumentService.API_PREFIX + resourceUrl,
      HeaderOptions.withIfMatchHeader(version));
  }

  private postToApi(resourceUrl: string, object: any): Observable<Response> {
    return this.http.post(HalDocumentService.API_PREFIX + resourceUrl, object);
  }

  private putToApi(resourceUrl: string, object: any, version: string): Observable<Response> {
    return this.http.put(HalDocumentService.API_PREFIX + resourceUrl, object,
      HeaderOptions.withIfMatchHeader(version));
  }
}
