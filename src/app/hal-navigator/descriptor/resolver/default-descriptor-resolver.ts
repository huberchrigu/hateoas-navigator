import {ResourceDescriptorResolver} from 'app/hal-navigator/descriptor/resolver/resource-descriptor-resolver';
import {ModuleConfiguration} from 'app/hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {CombiningDescriptor} from 'app/hal-navigator/descriptor/combining/combining-descriptor';
import {StaticPropertyDescriptor} from 'app/hal-navigator/descriptor/static/static-property-descriptor';
import {JsonSchemaDescriptor} from 'app/hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {AlpsPropertyDescriptor} from 'app/hal-navigator/descriptor/alps/alps-property-descriptor';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {SchemaService} from 'app/hal-navigator/resource-services/schema.service';

export class DefaultDescriptorResolver implements ResourceDescriptorResolver {

  constructor(private config: ModuleConfiguration, private schemaService: SchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningDescriptor> {
    return this.schemaService.getJsonSchema(resourceName)
      .combineLatest(this.schemaService.getAlps(resourceName), (jsonSchema, alps) => {
        const descriptors = [];
        if (this.config && this.config.itemDescriptors && this.config.itemDescriptors[resourceName]) {
          descriptors.push(new StaticPropertyDescriptor(resourceName, this.config.itemDescriptors[resourceName]));
        }
        descriptors.push(new JsonSchemaDescriptor(resourceName, jsonSchema, null,
          new SchemaReferenceFactory(jsonSchema.definitions), this.schemaService),
          new AlpsPropertyDescriptor(alps.getRepresentationDescriptor().descriptor, this.schemaService));
        return new CombiningDescriptor(descriptors);
      });
  }

  resolveWithAssociations(resourceName: string): Observable<PropertyDescriptor> {
    return this.resolve(resourceName)
      .flatMap(descriptor => descriptor.resolveAssociations());
  }
}
