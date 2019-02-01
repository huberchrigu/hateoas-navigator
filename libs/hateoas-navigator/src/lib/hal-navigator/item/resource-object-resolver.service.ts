import {tap, mergeMap, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LOGGER} from '../../logging/logger';
import {VersionedResourceAdapter} from './versioned-resource-adapter';
import {ResourceService} from '../resource-services/resource.service';
import {RouteParams} from '../routing/route-params';

@Injectable()
export class ResourceObjectResolverService implements Resolve<VersionedResourceAdapter> {

  constructor(private halDocumentService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedResourceAdapter> |
    Promise<VersionedResourceAdapter> | VersionedResourceAdapter {
    const resourceName = route.params[RouteParams.RESOURCE_PARAM];
    return this.halDocumentService
      .getItem(resourceName, route.params[RouteParams.ID_PARAM])
      .pipe(
        tap(() => LOGGER.debug(`${resourceName} successfully loaded, now resolving descriptors...`)),
        mergeMap(
          resource => resource.resolveDescriptorAndAssociations()
            .pipe(
              tap(() => LOGGER.debug('Descriptor successfully resolved')),
              map(() => resource))
        ));
  }
}
