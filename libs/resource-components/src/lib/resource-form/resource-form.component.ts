import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router, RouterLink} from '@angular/router';
import {FormField} from 'hateoas-navigator';
import {ReactiveFormsModule, UntypedFormGroup} from '@angular/forms';
import {ResourceService} from 'hateoas-navigator';
import {VersionedResourceObjectProperty} from 'hateoas-navigator';
import {ResourceLink} from 'hateoas-navigator';
import {FormControlFactory} from 'hateoas-navigator';
import {GenericPropertyDescriptor} from 'hateoas-navigator';
import {SubFormField} from 'hateoas-navigator';
import {Subscription} from 'rxjs';
import {CustomizableComponentType} from '../customizable';
import {FormGroupComponentInput} from './form-group';
import {CustomizableComponent} from '../customizable';
import {MatAnchor, MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  templateUrl: './resource-form.component.html',
  imports: [
    CustomizableComponent,
    ReactiveFormsModule,
    MatAnchor,
    RouterLink,
    MatButton,
    NgIf
  ],
  styleUrls: ['./resource-form.component.sass'],
  standalone: true
})
export class ResourceFormComponent implements OnInit {
  fields!: FormField[];
  title: string | undefined;
  form!: UntypedFormGroup;
  private newItem!: boolean;
  private version!: string;

  constructor(private route: ActivatedRoute, private router: Router, private halDocumentService: ResourceService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: Data | RouteData) => {
      const resourceObject = data.resourceObject;
      const descriptor = resourceObject ? resourceObject.getDescriptor() : data.resourceDescriptor;
      this.fields = (descriptor.toFormFieldBuilder().build() as SubFormField).getSubFields();
      this.title = descriptor.getTitle();
      const controls = new FormControlFactory(resourceObject).getControls(this.fields);
      this.form = new UntypedFormGroup(controls);
      this.newItem = !data.resourceObject;
      if (!this.newItem) {
        this.version = data.resourceObject.getVersion();
      }
    });
  }

  onSubmit(): Subscription {
    const submitFunction = this.newItem ?
      (resourceName: string, object: any) => this.halDocumentService.create(resourceName, object) :
      (resourceName: string, object: any) => this.halDocumentService.update(resourceName, this.route.snapshot.url[1].path, object, this.version);
    return submitFunction(this.route.snapshot.url[0].path, this.form.value).subscribe((item: VersionedResourceObjectProperty) => {
      return this.router.navigateByUrl(ResourceLink.fromResourceObject(item.getValue()!, undefined).toRelativeLink().getUri());
    });
  }

  getFormGroupType() {
    return CustomizableComponentType.FORM_GROUP;
  }

  getFormGroupInput(): FormGroupComponentInput {
    return {fields: this.fields, formGroup: this.form};
  }
}

interface RouteData extends Data {
  resourceObject: VersionedResourceObjectProperty;
  resourceDescriptor: GenericPropertyDescriptor;
}
