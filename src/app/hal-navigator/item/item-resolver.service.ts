import {Injectable} from '@angular/core';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from '@hal-navigator/routing/route-params';

@Injectable()
export class ResourceObjectResolverService implements Resolve<VersionedResourceAdapter> {

  constructor(private halDocumentService: HalDocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedResourceAdapter> |
    Promise<VersionedResourceAdapter> | VersionedResourceAdapter {
    return this.halDocumentService
      .getItem(route.params[RouteParams.RESOURCE_PARAM], route.params[RouteParams.ID_PARAM])
      .flatMap(resource => resource.resolveDescriptorAndAssociations()
        .map(() => resource));
  }
}
