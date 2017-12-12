import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Cacheable} from '@hal-navigator/cache/cacheable';
import {HeaderOptions} from '@hal-navigator/http/http/header-options';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {JsonSchemaDocument} from '@hal-navigator/schema/json-schema';
import {AlpsDocumentAdapter} from '@hal-navigator/alp-document/alps-document-adapter';
import {AlpsDocument} from '@hal-navigator/alp-document/alps-document';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {Api} from '@hal-navigator/resource-services/api';

@Injectable()
export class SchemaService {
  private static PROFILE_PREFIX = '/profile/';

  constructor(private httpClient: HttpClient, @Inject(MODULE_CONFIG) private moduleConfig: ModuleConfiguration) {
  }

  @Cacheable()
  getJsonSchema(resourceName: string): Observable<SchemaAdapter> {
    return this.getFromApi<JsonSchemaDocument>(SchemaService.PROFILE_PREFIX + resourceName,
      HeaderOptions.withAcceptHeader('application/schema+json'))
      .combineLatest(this.getAlps(resourceName), (schema, alps) =>
        new SchemaAdapter(schema, alps.getRepresentationDescriptor(), this.getItemDescriptor(resourceName), this));
  }

  @Cacheable()
  getAlps(resourceName: string): Observable<AlpsDocumentAdapter> {
    return this.getFromApi<AlpsDocument>(SchemaService.PROFILE_PREFIX + resourceName)
      .map(document => new AlpsDocumentAdapter(document));
  }

  private getFromApi<T>(resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, {headers: headers});
  }

  private getItemDescriptor(resourceName: string) {
    if (this.moduleConfig && this.moduleConfig.itemDescriptors) {
      return this.moduleConfig.itemDescriptors[resourceName];
    }
    return null;
  }
}
