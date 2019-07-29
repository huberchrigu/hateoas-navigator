import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {ResourceFormComponent} from './resource-form/resource-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ResourceItemComponent} from './resource-item/resource-item.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
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
import {ResourceSearchDialogComponent} from 'resource-components/resource-list/search-dialog/resource-search-dialog.component';

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
    ConfirmationDialogComponent,
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
    CheckboxFieldComponent
  ],
  exports: [NavigationComponent, ResourceListComponent],
  entryComponents: [ConfirmationDialogComponent, SendDataDialogComponent, ResourceSearchDialogComponent]
})
export class ResourceComponentsModule {
}
