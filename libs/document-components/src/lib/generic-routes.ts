import {ResourceItemComponent} from './resource-item/resource-item.component';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {ResourceFormComponent} from './resource-form/resource-form.component';
import {Routes} from '@angular/router';
import {RouteParams} from 'hateoas-navigator';
import {ResourceDescriptorResolverService} from 'hateoas-navigator';
import {ResourceObjectResolverService} from 'hateoas-navigator';
import {CollectionResolverService} from 'hateoas-navigator';

export class GenericRoutes {
  public static get(): Routes {
    return [
      {
        path: ':' + RouteParams.RESOURCE_PARAM + '/new',
        component: ResourceFormComponent,
        resolve: {
          resourceDescriptor: ResourceDescriptorResolverService
        }
      },
      {
        path: `:${RouteParams.RESOURCE_PARAM}/:${RouteParams.ID_PARAM}`,
        component: ResourceItemComponent,
        resolve: {
          resourceObject: ResourceObjectResolverService
        }
      },
      {
        path: `:${RouteParams.RESOURCE_PARAM}/:${RouteParams.ID_PARAM}/edit`,
        component: ResourceFormComponent,
        resolve: {
          resourceObject: ResourceObjectResolverService
        }
      },
      {
        path: ':' + RouteParams.RESOURCE_PARAM,
        component: ResourceListComponent,
        resolve: {
          collectionAdapter: CollectionResolverService
        }
      }
    ];
  }
}
