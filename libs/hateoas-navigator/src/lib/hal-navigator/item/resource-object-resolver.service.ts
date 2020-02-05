import {tap, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LOGGER} from '../../logging/logger';
import {VersionedResourceObjectPropertyImpl} from './versioned-resource-object-property-impl';
import {ResourceService} from '../resource-services/resource.service';
import {RouteParams} from '../routing/route-params';
import {VersionedResourceObjectProperty} from '../hal-resource/resource-object-property';
import {ResourceObjectPropertyFactoryService} from '../hal-resource/resource-object-property-factory.service';

@Injectable()
export class ResourceObjectResolverService implements Resolve<VersionedResourceObjectProperty> {

  constructor(private resourceService: ResourceService, private resourceFactory: ResourceObjectPropertyFactoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedResourceObjectProperty> |
    Promise<VersionedResourceObjectPropertyImpl> | VersionedResourceObjectPropertyImpl {
    const resourceName = route.params[RouteParams.RESOURCE_PARAM];
    return this.resourceService
      .getItem(resourceName, route.params[RouteParams.ID_PARAM])
      .pipe(
        tap(() => LOGGER.debug(`${resourceName} successfully loaded, now resolving descriptors...`)),
        mergeMap(resource => this.resourceFactory.resolveDescriptorAndAssociations(resource.getName(), resource.getValue(),
          resource.getVersion())),
        tap(resource => LOGGER.debug(`Descriptor ${resource.getDescriptor().getName()} successfully resolved`))
      );
  }
}
