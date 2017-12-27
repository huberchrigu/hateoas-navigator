import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from '@hal-navigator/routing/route-params';
import {Injectable} from '@angular/core';

// TODO: Resolve naming conflict with ResourceDescriptorResolver (which should be a service actually too)
@Injectable()
export class ResourceDescriptorResolverService implements Resolve<ResourceDescriptor> {
  constructor(private resourceDescriptorResolver: ResourceDescriptorResolver) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResourceDescriptor> |
    Promise<ResourceDescriptor> | ResourceDescriptor {
    return this.resourceDescriptorResolver.resolve(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
