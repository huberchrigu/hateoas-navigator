import {tap, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LOGGER} from '../../logging/logger';
import {VersionedResourceAdapter} from './versioned-resource-adapter';
import {ResourceService} from '../resource-services/resource.service';
import {RouteParams} from '../routing/route-params';
import {VersionedJsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';
import {ResourceAdapterFactoryService} from 'hateoas-navigator/hal-navigator/hal-resource/resource-adapter-factory.service';

@Injectable()
export class ResourceObjectResolverService implements Resolve<VersionedJsonResourceObject> {

  constructor(private resourceService: ResourceService, private resourceFactory: ResourceAdapterFactoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedJsonResourceObject> |
    Promise<VersionedResourceAdapter> | VersionedResourceAdapter {
    const resourceName = route.params[RouteParams.RESOURCE_PARAM];
    return this.resourceService
      .getItem(resourceName, route.params[RouteParams.ID_PARAM])
      .pipe(
        tap(() => LOGGER.debug(`${resourceName} successfully loaded, now resolving descriptors...`)),
        mergeMap(resource => this.resourceFactory.resolveDescriptorAndAssociations(resource.getName(), resource.getValue(), resource.getVersion())),
        tap(resource => LOGGER.debug(`Descriptor ${resource.getDescriptor().getName()} successfully resolved`))
      );
  }
}
