import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {ResourceSearchDialogData} from './resource-search-dialog-data';
import {ResourceSearchDialogResult} from './resource-search-dialog-result';
import {
  FormControlFactory,
  FormField,
  MODULE_CONFIG,
  ModuleConfiguration,
  FormFieldSupport, PropertyConfig,
  QueryConfig,
  ResourceDescriptor,
  ResourceLink, FormFieldBuilder
} from 'hateoas-navigator';
import {LOGGER} from 'hateoas-navigator/logging/logger';

@Component({
  templateUrl: './resource-search-dialog.component.html',
  styleUrls: ['../../resource-form/form-fields.sass']
})
export class ResourceSearchDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ResourceSearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ResourceSearchDialogData,
              @Inject(MODULE_CONFIG) private config: ModuleConfiguration) {
    this.urls = data.urls ? data.urls : [];
    this.descriptor = data.descriptor;
  }

  private descriptor: ResourceDescriptor;

  options = [];
  urls: ResourceLink[];
  title = 'Select query';
  queryControl = new FormControl();
  fieldControls = new FormGroup({});
  form = new FormGroup({
    query: this.queryControl,
    params: this.fieldControls
  });
  fields: FormField[] = [];

  ngOnInit(): void {
    this.initOptions();
    this.queryControl.valueChanges.subscribe(() => this.updateParameters());
  }

  onCancel() {
    this.dialogRef.close(new ResourceSearchDialogResult(null));
  }

  onSubmit() {
    this.dialogRef.close(new ResourceSearchDialogResult(this.getFinalUrl()));
  }

  private initOptions() {
    for (let i = 0; i < this.urls.length; i++) {
      const relationType = this.urls[i].getRelationType();
      this.options.push({
        key: i,
        title: this.getQueryTitle(relationType, relationType)
      });
    }
  }

  private getQueryTitle(query: string, defaultValue: string): string {
    const config = this.getQueryConfig(query);
    const title = config ? config.title : null;
    if (!title) {
      LOGGER.warn(`Query ${query} has no configured title!`);
      return defaultValue;
    }
    return title;
  }

  private getFinalUrl() {
    const values: { [param: string]: string } = this.fieldControls.value;
    const url = this.urls[this.queryControl.value];
    return url.getRelativeUriWithReplacedTemplatedParts(values);
  }

  /**
   * Based on the chosen query's templated parts, descriptors are retrieved and converted to {@link FormField}s and {@link FormControl}s.
   * <ul>
   *   <li>Fields are always required, because the query does not make sense otherwise</li>
   * </ul>
   *
   * Issues:
   * <ul>
   *   <li>There might be query parameters that do not match resource model</li>
   *   <li>There might be query parameters that are nested (objects)</li>
   * </ul>
   */
  private updateParameters() {
    const value = this.queryControl.value;
    const newParams = this.urls[value].getTemplatedParts();

    this.fields.splice(0, this.fields.length, ...this.toFields(newParams, this.getQueryConfig(this.urls[value].getRelationType())));
    const newControls = new FormControlFactory().getControls(this.fields);
    Object.keys(this.fieldControls.controls).forEach(control => this.fieldControls.removeControl(control));
    Object.keys(newControls).forEach(control => this.fieldControls.addControl(control, newControls[control]));
  }

  private toFields(newParams: string[], queryConfig: QueryConfig): FormField[] {
    return newParams.map(param => this.toField(param, queryConfig && queryConfig.params ? queryConfig.params[param] : null));
  }

  private toField(param: string, config: FormFieldSupport): FormField {
    const childDescriptor = this.descriptor.getChildDescriptor(param);
    const builder = childDescriptor ? childDescriptor.toFormFieldBuilder() : new FormFieldBuilder(param);
    return builder.withRequired(true)
      .fromConfig(config)
      .build();
  }

  private getResourceConfig(): PropertyConfig {
    const resourceName = this.descriptor.getName();
    return this.config.itemConfigs ? this.config.itemConfigs[resourceName] : null;
  }

  private getQueryConfig(query: string): QueryConfig {
    const config = this.getResourceConfig();
    return config && config.queries ? config.queries[query] : null;
  }
}
