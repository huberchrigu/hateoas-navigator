import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResourceListComponent} from './resource-list';
import {NavigationComponent} from './navigation';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {ResourceFormComponent} from './resource-form';
import {ReactiveFormsModule} from '@angular/forms';
import {ResourceItemComponent} from './resource-item';
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
import {CheckboxFieldComponent} from './resource-form/checkbox-field/checkbox-field.component';
import {SendDataDialogComponent} from './resource-item/send-data-dialog/send-data-dialog.component';
import {ResourceSearchDialogComponent} from './resource-list/search-dialog/resource-search-dialog.component';
import {LoginDialogComponent} from './navigation/login/login-dialog.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './http/http-interceptor.service';
import {CurrentUserProviderService} from './navigation/login/current-user-provider.service';
import {CurrentUserProvider} from 'hateoas-navigator';
import {CustomizableComponent} from './customizable';
import {CustomizableDirective} from './customizable/customizable.directive';
import {ResourceComponentsConfiguration} from './resource-components-configuration';
import {CustomComponentService} from './customizable/custom-component.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

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
    LoginDialogComponent,
    CustomizableComponent,
    CustomizableDirective
  ],
  declarations: [],
  exports: [NavigationComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: CurrentUserProvider, useClass: CurrentUserProviderService}
  ]
})
export class ResourceComponentsModule {
  static forRoot(configuration = new ResourceComponentsConfiguration([])): ModuleWithProviders<ResourceComponentsModule> {
    return {
      ngModule: ResourceComponentsModule,
      providers: [
        {provide: CustomComponentService, useFactory: () => new CustomComponentService(configuration.customComponents)}
      ]
    };
  }
}
