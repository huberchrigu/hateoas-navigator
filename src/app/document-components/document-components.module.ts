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
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { InputFieldComponent } from './resource-form/input-field/input-field.component';
import { DateTimeComponent } from './resource-form/date-time/date-time.component';
import { SubFormComponent } from './resource-form/sub-form/sub-form.component';
import { SubFormArrayComponent } from './resource-form/sub-form-array/sub-form-array.component';
import { ItemPropertiesComponent } from './resource-item/item-properties/item-properties.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {SelectFieldComponent} from '@document-components/resource-form/select-field/select-field.component';

@NgModule({
  imports: [
    AppRoutingModule,

    CommonModule,
    ReactiveFormsModule,

    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
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
    DateTimeComponent,
    SelectFieldComponent,
    SubFormComponent,
    SubFormArrayComponent,
    ItemPropertiesComponent
  ],
  exports: [NavigationComponent, ResourceListComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class DocumentComponentsModule {
}
