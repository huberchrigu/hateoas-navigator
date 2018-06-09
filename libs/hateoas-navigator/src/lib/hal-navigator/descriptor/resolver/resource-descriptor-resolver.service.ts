import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PropertyDescriptor} from '../property-descriptor';
import {Observable} from 'rxjs';
import {RouteParams} from '../../routing/route-params';
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
