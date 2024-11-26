import {NgModule} from '@angular/core';
import {
  RouterModule, Routes
} from '@angular/router';
import {HomeComponent} from '../static-components/home.component';
import {GenericRoutes} from 'resource-components';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  ...GenericRoutes.get(), // does not work when using built library
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
