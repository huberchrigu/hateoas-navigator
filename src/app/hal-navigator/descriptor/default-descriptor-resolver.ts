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
        return new CombiningDescriptor([
          new StaticResourceDescriptor(resourceName, this.config),
          new JsonSchemaDescriptor(resourceName, jsonSchema.getSchema(),
            new SchemaReferenceFactory(jsonSchema.getSchema().definitions), this.schemaService),
          new AlpsResourceDescriptor(alps.getRepresentationDescriptor().descriptor, this.schemaService)
        ]);
      });
  }

  resolveWithAssociations(resourceName: string): Observable<ResourceDescriptor> {
    return this.resolve(resourceName)
      .flatMap(descriptor => descriptor.resolveAssociations());
  }
}
