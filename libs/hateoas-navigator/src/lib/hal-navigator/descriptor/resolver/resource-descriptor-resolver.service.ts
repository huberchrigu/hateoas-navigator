import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PropDescriptor} from '../prop-descriptor';
import {Observable} from 'rxjs';
import {RouteParams} from '../../routing/route-params';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourceDescriptorResolverService implements Resolve<PropDescriptor> {
  constructor(private resourceDescriptorResolver: ResourceDescriptorProvider) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropDescriptor> |
    Promise<PropDescriptor> | PropDescriptor {
    return this.resourceDescriptorResolver.resolve(route.params[RouteParams.RESOURCE_PARAM]);
  }
}
