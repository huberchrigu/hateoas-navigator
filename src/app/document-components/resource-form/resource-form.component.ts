import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormGroup} from '@angular/forms';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {DeprecatedLinkFactory} from '@hal-navigator/link-object/link-factory';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';

@Component({
  selector: 'app-new-resource',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.sass']
})
export class ResourceFormComponent implements OnInit {
  fields: FormField[];
  title: string;
  form: FormGroup;

  private linkFactory = new DeprecatedLinkFactory();
  private newItem: boolean;
  private version: string;

  constructor(private route: ActivatedRoute, private router: Router, private halDocumentService: HalDocumentService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { schemaAdapter: SchemaAdapter, itemAdapter: ItemAdapter }) => {
      this.fields = data.schemaAdapter.getFields();
      this.title = data.schemaAdapter.getTitle();
      this.form = new FormGroup(data.schemaAdapter.asControls(data.itemAdapter));
      this.newItem = !data.itemAdapter;
      if (!this.newItem) {
        this.version = data.itemAdapter.getVersion();
      }
    });
  }

  onSubmit() {
    const submitFunction = this.newItem ?
      (resourceName, object) => this.halDocumentService.create(resourceName, object) :
      (resourceName, object) => this.halDocumentService.update(resourceName, this.route.snapshot.url[1].path, object, this.version);
    return submitFunction(this.route.snapshot.url[0].path, this.form.value).subscribe((item: ItemAdapter) => {
      return this.router.navigateByUrl(this.linkFactory.fromDocument(item.getDocument()));
    });
  }
}
