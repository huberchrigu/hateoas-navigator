import {map, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CollectionAdapter} from './collection-adapter';
import {ResourceService} from '../resource-services/resource.service';
import {RouteParams} from '../routing/route-params';
import {Observable} from 'rxjs';
import {ResourceAdapterFactoryService} from '../hal-resource/resource-adapter-factory.service';

@Injectable()
export class CollectionResolverService implements Resolve<CollectionAdapter> {

  constructor(private halDocumentService: ResourceService, private resourceFactory: ResourceAdapterFactoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CollectionAdapter> | Promise<CollectionAdapter> |
    CollectionAdapter {
    return this.halDocumentService
      .getCollection(route.params[RouteParams.RESOURCE_PARAM]).pipe(
        mergeMap(collection => collection.resolve()),
        map(resource => new CollectionAdapter(this.resourceFactory, resource))
      );
  }
}
