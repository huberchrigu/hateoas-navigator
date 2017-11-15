import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {AppRoutingModule} from '../app-routing/app-routing.module';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {ResourceFormComponent} from './resource-form/resource-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ResourceItemComponent} from './resource-item/resource-item.component';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {InputFieldComponent} from './resource-form/input-field/input-field.component';
import {DateTimeFieldComponent} from './resource-form/date-time-field/date-time-field.component';
import {FormGroupComponent} from './resource-form/form-group/form-group.component';
import {FormListComponent} from './resource-form/form-list/form-list.component';
import {ItemPropertiesComponent} from './resource-item/item-properties/item-properties.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {SelectFieldComponent} from '@document-components/resource-form/select-field/select-field.component';
import {AssociationFieldComponent} from './resource-form/association-field/association-field.component';
import { FormFieldComponent } from './resource-form/form-field/form-field.component';

@NgModule({
  imports: [
    AppRoutingModule,

    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    // MatDatepickerModule,
    MatNativeDateModule,

    Md2DatepickerModule,
    MdNativeDateModule
  ],
  declarations: [
    NavigationComponent,
    ResourceListComponent,
    ConfirmationDialogComponent,
    ResourceFormComponent,
    ResourceItemComponent,
    InputFieldComponent,
    DateTimeFieldComponent,
    SelectFieldComponent,
    FormGroupComponent,
    FormListComponent,
    ItemPropertiesComponent,
    AssociationFieldComponent,
    FormFieldComponent
  ],
  exports: [NavigationComponent, ResourceListComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class DocumentComponentsModule {
}
