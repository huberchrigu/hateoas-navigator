import {Injectable} from '@angular/core';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from '@hal-navigator/routing/route-params';
import {LOGGER} from '../../logging/logger';
import 'rxjs/add/operator/do';

@Injectable()
export class ResourceObjectResolverService implements Resolve<VersionedResourceAdapter> {

  constructor(private halDocumentService: HalDocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedResourceAdapter> |
    Promise<VersionedResourceAdapter> | VersionedResourceAdapter {
    const resourceName = route.params[RouteParams.RESOURCE_PARAM];
    return this.halDocumentService
      .getItem(resourceName, route.params[RouteParams.ID_PARAM])
      .do(() => LOGGER.debug(`${resourceName} successfully loaded, now resolving descriptors...`))
      .flatMap(resource => resource.resolveDescriptorAndAssociations()
        .do(() => LOGGER.debug('Descriptor successfully resolved'))
        .map(() => resource));
  }
}
