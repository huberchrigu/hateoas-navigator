import {ResourceItemComponent} from './resource-item/resource-item.component';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {ResourceFormComponent} from './resource-form/resource-form.component';
import {Routes} from '@angular/router';
import {RouteParams} from 'hateoas-navigator';
import {ResourceDescriptorResolverService} from 'hateoas-navigator';
import {ResourceObjectResolverService} from 'hateoas-navigator';
import {CollectionResolverService} from 'hateoas-navigator';

/**
 * Provides route configurations for editing, creating, listing and viewing resource items.
 */
export class GenericRoutes {
  static readonly NEW_ITEM = {
    path: ':' + RouteParams.RESOURCE_PARAM + '/new',
    component: ResourceFormComponent,
    resolve: {
      resourceDescriptor: ResourceDescriptorResolverService
    }
  };

  static readonly ITEM_DETAILS = {
    path: `:${RouteParams.RESOURCE_PARAM}/:${RouteParams.ID_PARAM}`,
    component: ResourceItemComponent,
    resolve: {
      resourceObject: ResourceObjectResolverService
    }
  };

  static readonly EDIT_ITEM = {
    path: `:${RouteParams.RESOURCE_PARAM}/:${RouteParams.ID_PARAM}/edit`,
    component: ResourceFormComponent,
    resolve: {
      resourceObject: ResourceObjectResolverService
    }
  };

  static readonly COLLECTION = {
    path: ':' + RouteParams.RESOURCE_PARAM,
    component: ResourceListComponent,
    resolve: {
      collectionAdapter: CollectionResolverService
    }
  };

  public static get(): Routes {
    return [
      GenericRoutes.NEW_ITEM,
      GenericRoutes.ITEM_DETAILS,
      GenericRoutes.EDIT_ITEM,
      GenericRoutes.COLLECTION
    ];
  }
}
