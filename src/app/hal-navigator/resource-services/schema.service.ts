import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Cacheable} from '@hal-navigator/cache/cacheable';
import {HeaderOptions} from '@hal-navigator/http/header-options';
import {JsonSchemaDocument} from '@hal-navigator/schema/json-schema';
import {AlpsDocumentAdapter} from '@hal-navigator/alps-document/alps-document-adapter';
import {AlpsDocument} from '@hal-navigator/alps-document/alps-document';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {Api} from '@hal-navigator/resource-services/api';
import {Required, Validate} from '../../decorators/required';

@Injectable()
export class SchemaService {
  private static PROFILE_PREFIX = '/profile/';

  constructor(private httpClient: HttpClient, @Inject(MODULE_CONFIG) private moduleConfig: ModuleConfiguration) {
  }

  @Cacheable()
  getJsonSchema(resourceName: string): Observable<JsonSchemaDocument> {
    return this.getFromApi<JsonSchemaDocument>(SchemaService.PROFILE_PREFIX + resourceName,
      HeaderOptions.withAcceptHeader('application/schema+json'));
  }

  @Cacheable()
  getAlps(resourceName: string): Observable<AlpsDocumentAdapter> {
    return this.getFromApi<AlpsDocument>(SchemaService.PROFILE_PREFIX + resourceName)
      .map(document => new AlpsDocumentAdapter(document));
  }

  @Validate
  private getFromApi<T>(@Required resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, {headers: headers});
  }
}
