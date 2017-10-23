import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SchemaAdapter} from './schema-adapter';
import {Observable} from 'rxjs/Observable';
import {HalDocumentService} from '../hal-document/hal-document.service';
import {RouteParams} from '@hal-navigator/routing/route-params';

@Injectable()
export class SchemaResolverService implements Resolve<SchemaAdapter> {

  constructor(private halDocumentService: HalDocumentService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SchemaAdapter> | Promise<SchemaAdapter> |
    SchemaAdapter {
    return this.halDocumentService.getSchema(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
