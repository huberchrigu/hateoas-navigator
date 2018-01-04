import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {ModuleConfiguration} from 'app/hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {CombiningDescriptor} from 'app/hal-navigator/descriptor/combining/combining-descriptor';
import {StaticPropertyDescriptor} from 'app/hal-navigator/descriptor/static/static-property-descriptor';
import {JsonSchemaDescriptor} from 'app/hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {AlpsPropertyDescriptor} from 'app/hal-navigator/descriptor/alps/alps-property-descriptor';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {SchemaService} from 'app/hal-navigator/resource-services/schema.service';

export class DefaultDescriptorProvider implements ResourceDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: SchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningDescriptor> {
    return this.schemaService.getJsonSchema(resourceName)
      .combineLatest(this.schemaService.getAlps(resourceName), (jsonSchema, alps) => {
        const descriptors = [];
        if (this.config && this.config.itemConfigs && this.config.itemConfigs[resourceName]) {
          descriptors.push(new StaticPropertyDescriptor(resourceName, this.config.itemConfigs[resourceName], this.config.itemConfigs));
        }
        descriptors.push(new JsonSchemaDescriptor(resourceName, jsonSchema, null,
          new SchemaReferenceFactory(jsonSchema.definitions)),
          new AlpsPropertyDescriptor(alps.getRepresentationDescriptor().descriptor));
        return new CombiningDescriptor(descriptors);
      });
  }
}
