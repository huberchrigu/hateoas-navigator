import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ResourceSearchDialogData} from './resource-search-dialog-data';
import {ResourceSearchDialogResult} from './resource-search-dialog-result';
import {ResourceLink} from 'hateoas-navigator';

class ParameterControl extends FormControl {
  constructor(public id: string) {
    super();
  }
}

@Component({
  templateUrl: './resource-search-dialog.component.html',
  styleUrls: ['../../resource-form/form-fields.sass']
})
export class ResourceSearchDialogComponent implements OnInit {

  options = [];
  urls: ResourceLink[];
  title = 'Select query';
  queryControl = new FormControl();
  parameterControls: ParameterControl[] = [];
  form = new FormGroup({
    query: this.queryControl,
    params: new FormArray(this.parameterControls)
  });

  constructor(private dialogRef: MatDialogRef<ResourceSearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ResourceSearchDialogData) {
    this.urls = data.urls ? data.urls : [];
  }

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

  getParameters() {
    return this.parameterControls;
  }

  private initOptions() {
    for (let i = 0; i < this.urls.length; i++) {
      this.options.push({
        key: i,
        value: this.urls[i].getRelationType()
      });
    }
  }

  private getFinalUrl() {
    const values: { [param: string]: string } = {};
    const parameters = this.getParameters();
    for (let i = 0; i < parameters.length; i++) {
      values[(parameters[i].id)] = this.parameterControls[i].value;
    }
    const url = this.urls[this.queryControl.value];
    return url.getRelativeUriWithReplacedTemplatedParts(values);
  }

  private updateParameters() {
    const value = this.queryControl.value;
    const newParams = this.urls[value].getTemplatedParts().map(part => new ParameterControl(part));

    this.parameterControls.splice(0, this.parameterControls.length, ...newParams);
  }
}
