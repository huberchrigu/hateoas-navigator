import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from 'app/hal-navigator/routing/route-params';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourceDescriptorResolverService implements Resolve<PropertyDescriptor> {
  constructor(private resourceDescriptorResolver: ResourceDescriptorProvider) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyDescriptor> |
    Promise<PropertyDescriptor> | PropertyDescriptor {
    return this.resourceDescriptorResolver.resolve(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
