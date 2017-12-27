import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {CombiningDescriptor} from '@hal-navigator/descriptor/combining-descriptor';
import {StaticResourceDescriptor} from '@hal-navigator/descriptor/static-resource-descriptor';
import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema-descriptor';
import {AlpsResourceDescriptor} from '@hal-navigator/descriptor/alps-resource-descriptor';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';

export class DefaultDescriptorResolver implements ResourceDescriptorResolver {

  constructor(private config: ModuleConfiguration, private schemaService: SchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningDescriptor> {
    return this.schemaService.getJsonSchema(resourceName)
      .combineLatest(this.schemaService.getAlps(resourceName), (jsonSchema, alps) => {
        const descriptors = [];
        if (this.config && this.config.itemDescriptors) {
          descriptors.push(new StaticResourceDescriptor(resourceName, this.config.itemDescriptors[resourceName]));
        }
        descriptors.push(new JsonSchemaDescriptor(resourceName, jsonSchema,
          new SchemaReferenceFactory(jsonSchema.definitions), this.schemaService),
          new AlpsResourceDescriptor(alps.getRepresentationDescriptor().descriptor, this.schemaService));
        return new CombiningDescriptor(descriptors);
      });
  }

  resolveWithAssociations(resourceName: string): Observable<ResourceDescriptor> {
    return this.resolve(resourceName)
      .flatMap(descriptor => descriptor.resolveAssociations());
  }
}
