import {map, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CollectionAdapter} from './collection-adapter';
import {HalDocumentService} from '../resource-services/hal-document.service';
import {RouteParams} from '../routing/route-params';
import {Observable} from 'rxjs';

@Injectable()
export class CollectionResolverService implements Resolve<CollectionAdapter> {

  constructor(private halDocumentService: HalDocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionAdapter> | Promise<CollectionAdapter> |
    CollectionAdapter {
    return this.halDocumentService
      .getCollection(route.params[RouteParams.RESOURCE_PARAM]).pipe(
      mergeMap(collection => collection.resolve().pipe(map(() => collection))));
  }
}
