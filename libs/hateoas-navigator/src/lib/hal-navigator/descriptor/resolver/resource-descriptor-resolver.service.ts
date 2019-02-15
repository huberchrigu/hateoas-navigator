import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DeprecatedPropertyDescriptor} from '../deprecated-property-descriptor';
import {Observable} from 'rxjs';
import {RouteParams} from '../../routing/route-params';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourceDescriptorResolverService implements Resolve<DeprecatedPropertyDescriptor> {
  constructor(private resourceDescriptorResolver: ResourceDescriptorProvider) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DeprecatedPropertyDescriptor> |
    Promise<DeprecatedPropertyDescriptor> | DeprecatedPropertyDescriptor {
    return this.resourceDescriptorResolver.resolve(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
