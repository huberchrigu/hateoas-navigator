import {NgModule} from '@angular/core';
import {
  RouterModule, Routes
} from '@angular/router';
import {HomeComponent} from '../static-components/home.component';
import {ResourceListComponent} from '@document-components/resource-list/resource-list.component';
import {CollectionResolverService} from '@hal-navigator/collection/collection-resolver.service';
import {ResourceFormComponent} from '@document-components/resource-form/resource-form.component';
import {ResourceItemComponent} from '@document-components/resource-item/resource-item.component';
import {RouteParams} from '@hal-navigator/routing/route-params';
import {ResourceObjectResolverService} from '@hal-navigator/item/item-resolver.service';
import {ResourceDescriptorResolverService} from '@hal-navigator/descriptor/resolver/resource-descriptor-resolver.service';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: ':' + RouteParams.RESOURCE_PARAM + '/new',
    component: ResourceFormComponent,
    resolve: {resourceDescriptor: ResourceDescriptorResolverService}
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
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
