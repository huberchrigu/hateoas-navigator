import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {ResourceFormComponent} from './resource-form/resource-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ResourceItemComponent} from './resource-item/resource-item.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {InputFieldComponent} from './resource-form/input-field/input-field.component';
import {DateTimeFieldComponent} from './resource-form/date-time-field/date-time-field.component';
import {FormGroupComponent} from './resource-form/form-group/form-group.component';
import {FormListComponent} from './resource-form/form-list/form-list.component';
import {ItemPropertiesComponent} from './resource-item/item-properties/item-properties.component';
import {SelectFieldComponent} from './resource-form/select-field/select-field.component';
import {AssociationFieldComponent} from './resource-form/association-field/association-field.component';
import {FormFieldComponent} from './resource-form/form-field/form-field.component';
import {RouterModule} from '@angular/router';
import {MatDatepickerModule, MatMomentDateModule} from '@coachcare/datepicker';
import {CheckboxFieldComponent} from './resource-form/checkbox-field/checkbox-field.component';
import {SendDataDialogComponent} from './send-data-dialog/send-data-dialog.component';
import {ResourceSearchDialogComponent} from './resource-list/search-dialog/resource-search-dialog.component';
import {LoginDialogComponent} from './navigation/login/login-dialog.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './http/http-interceptor.service';
import {CurrentUserProvider} from 'hateoas-navigator/hal-navigator/resource-services/current-user-provider';
import {CurrentUserProviderService} from './navigation/login/current-user-provider.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatNativeDateModule,

    MatDatepickerModule,
    MatMomentDateModule
  ],
  declarations: [
    NavigationComponent,
    ResourceListComponent,
    ResourceSearchDialogComponent,
    MessageDialogComponent,
    SendDataDialogComponent,
    ResourceFormComponent,
    ResourceItemComponent,
    InputFieldComponent,
    DateTimeFieldComponent,
    SelectFieldComponent,
    FormGroupComponent,
    FormListComponent,
    ItemPropertiesComponent,
    AssociationFieldComponent,
    FormFieldComponent,
    CheckboxFieldComponent,
    LoginDialogComponent
  ],
  exports: [NavigationComponent, ResourceListComponent],
  entryComponents: [MessageDialogComponent, SendDataDialogComponent, ResourceSearchDialogComponent, LoginDialogComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: CurrentUserProvider, useClass: CurrentUserProviderService}
  ]
})
export class ResourceComponentsModule {
}
