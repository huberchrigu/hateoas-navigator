import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Required, Validate} from '../../decorators/required';
import {MODULE_CONFIG, ModuleConfiguration} from '../config';
import {Cacheable} from '../cache/cacheable';
import {JsonSchemaDocument} from '../schema/json-schema';
import {HeaderOptions} from '../http/header-options';
import {AlpsDocumentAdapter} from '../alps-document/alps-document-adapter';
import {AlpsDocument} from '../alps-document/alps-document';
import {Api} from './api';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
      .pipe(map(document => new AlpsDocumentAdapter(document)));
  }

  @Validate
  private getFromApi<T>(@Required resourceUrl: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(Api.PREFIX + resourceUrl, {headers: headers});
  }
}
