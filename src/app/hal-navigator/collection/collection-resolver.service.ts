import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CollectionAdapter} from './collection-adapter';
import {Observable} from 'rxjs/Observable';
import {HalDocumentService} from '../hal-document/hal-document.service';
import {RouteParams} from '@hal-navigator/routing/route-params';

@Injectable()
export class CollectionResolverService implements Resolve<CollectionAdapter> {

  constructor(private halDocumentService: HalDocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionAdapter> | Promise<CollectionAdapter> |
    CollectionAdapter {
    return this.halDocumentService.getCollection(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
