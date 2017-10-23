import {Component, OnInit} from '@angular/core';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {NavigationItem} from '@hal-navigator/navigation/navigation-item';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  items: Array<NavigationItem>;

  private schemas: { [name: string]: SchemaAdapter } = {};

  constructor(private halDocumentService: HalDocumentService) {

  }

  ngOnInit(): void {
    this.halDocumentService.getRootNavigation().subscribe(navigation => {
      this.items = navigation.getItems();
      this.getSchemas();
    });
  }

  getTitle(item: NavigationItem) {
    const schema = this.schemas[item.name];
    if (schema) {
      return schema.getTitle();
    }
    return item.name;
  }

  private getSchemas() {
    this.items.forEach(item => {
      this.halDocumentService.getSchema(item.name).subscribe(schema => this.schemas[item.name] = schema);
    });
  }
}
