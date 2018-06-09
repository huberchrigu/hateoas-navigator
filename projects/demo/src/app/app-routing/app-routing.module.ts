import {NgModule} from '@angular/core';
import {
  RouterModule, Routes
} from '@angular/router';
import {HomeComponent} from '../static-components/home.component';
import { ResourceFormComponent, ResourceItemComponent, ResourceListComponent} from 'document-components';
import {CollectionResolverService, ResourceDescriptorResolverService, ResourceObjectResolverService, RouteParams} from 'hateoas-navigator';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  // TODO: Next four entries are copied from GenericRoutes, but this results in an error
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
