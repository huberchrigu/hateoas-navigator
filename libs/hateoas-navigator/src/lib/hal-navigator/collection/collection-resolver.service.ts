import {flatMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CollectionAdapter} from './collection-adapter';
import {ResourceService} from '../resource-services/resource.service';
import {RouteParams} from '../routing/route-params';
import {Observable} from 'rxjs';

@Injectable()
export class CollectionResolverService implements Resolve<CollectionAdapter> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionAdapter> | Promise<CollectionAdapter> |
    CollectionAdapter {
    return this.resourceService
      .getCollection(route.params[RouteParams.RESOURCE_PARAM]).pipe(
        flatMap(collection => collection.resolve())
      );
  }
}
