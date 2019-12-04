import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormField} from 'hateoas-navigator';
import {FormGroup} from '@angular/forms';
import {ResourceService} from 'hateoas-navigator';
import {VersionedResourceAdapter} from 'hateoas-navigator';
import {ResourceLink} from 'hateoas-navigator';
import {FormControlFactory} from 'hateoas-navigator';
import {PropDescriptor} from 'hateoas-navigator';
import {SubFormField} from 'hateoas-navigator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lib-new-resource',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.sass']
})
export class ResourceFormComponent implements OnInit {
  fields: FormField[];
  title: string;
  form: FormGroup;
  private newItem: boolean;
  private version: string;

  constructor(private route: ActivatedRoute, private router: Router, private halDocumentService: ResourceService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resourceObject: VersionedResourceAdapter, resourceDescriptor: PropDescriptor }) => {
      const resourceObject = data.resourceObject;
      const descriptor = resourceObject ? resourceObject.getDescriptor() : data.resourceDescriptor;
      this.fields = (descriptor.toFormFieldBuilder().build() as SubFormField).getSubFields();
      this.title = descriptor.getTitle();
      const controls = new FormControlFactory(resourceObject).getControls(this.fields);
      this.form = new FormGroup(controls);
      this.newItem = !data.resourceObject;
      if (!this.newItem) {
        this.version = data.resourceObject.getVersion();
      }
    });
  }

  onSubmit(): Subscription {
    const submitFunction = this.newItem ?
      (resourceName, object) => this.halDocumentService.create(resourceName, object) :
      (resourceName, object) => this.halDocumentService.update(resourceName, this.route.snapshot.url[1].path, object, this.version);
    return submitFunction(this.route.snapshot.url[0].path, this.form.value).subscribe((item: VersionedResourceAdapter) => {
      return this.router.navigateByUrl(ResourceLink.fromResourceObject(item.getValue(), undefined).toRelativeLink().getUri());
    });
  }
}
