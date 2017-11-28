import {Component, Input, OnInit} from '@angular/core';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {NotNull} from '../../../decorators/not-null';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';

@Component({
  selector: 'app-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent implements OnInit {

  @Input()
  properties: ResourceProperty[];

  @Input()
  private schema: SchemaAdapter;

  private schemaReferenceFactory: SchemaReferenceFactory;
  private propertyDefinitions: { [propertyName: string]: SchemaAdapter } = {};

  constructor(private halDocumentService: HalDocumentService) {
  }

  ngOnInit() {
    if (!this.schema) {
      throw new Error('"schema" is required');
    }
    this.initFactory();
    this.properties.filter(p => p.isArray()).forEach(p => this.initPropertySchema(p));
  }

  getPropertyTitle(property: ResourceProperty): string {
    return this.getPropertySchema(property).title;
  }

  getDefinition(arrayProperty: ResourceProperty): SchemaAdapter {
    return this.propertyDefinitions[arrayProperty.getName()];
  }

  private initPropertySchema(arrayProperty: ResourceProperty) {
    const arrayItems = this.getPropertySchema(arrayProperty).items;
    let schema: JsonSchema;
    if (arrayItems.$ref) {
      schema = this.schemaReferenceFactory.getReferencedSchema(arrayItems);
    } else {
      schema = arrayItems;
    }
    const alpsDescriptor = this.schema.getAlpsDescriptorForProperty(arrayProperty);
    const itemDescriptor = this.schema.getPropertyDescriptor(arrayProperty);
    new SchemaAdapter(schema, alpsDescriptor, itemDescriptor, this.halDocumentService)
      .resolve()
      .subscribe(resolvedSchema => this.propertyDefinitions[arrayProperty.getName()] = resolvedSchema);
  }

  @NotNull()
  private getPropertySchema(property: ResourceProperty): JsonSchema {
    return this.schema.getSchema().properties[property.getName()];
  }

  private initFactory() {
    this.schemaReferenceFactory = new SchemaReferenceFactory(this.schema.getSchema().definitions);
  }
}
