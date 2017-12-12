import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SchemaAdapter} from './schema-adapter';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from '@hal-navigator/routing/route-params';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';

@Injectable()
export class SchemaResolverService implements Resolve<SchemaAdapter> {

  constructor(private schemaService: SchemaService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SchemaAdapter> | Promise<SchemaAdapter> |
    SchemaAdapter {
    return this.schemaService.getJsonSchema(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
