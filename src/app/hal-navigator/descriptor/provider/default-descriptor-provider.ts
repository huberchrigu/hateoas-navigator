import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {ModuleConfiguration} from 'app/hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {SchemaService} from 'app/hal-navigator/resource-services/schema.service';
import {CombiningResourceDescriptor} from '@hal-navigator/descriptor/combining/combining-resource-descriptor';
import {StaticResourceDescriptor} from '@hal-navigator/descriptor/static/static-resource-descriptor';
import {JsonSchemaResourceDescriptor} from '@hal-navigator/descriptor/json-schema/json-schema-resource-descriptor';
import {AlpsResourceDescriptor} from '@hal-navigator/descriptor/alps/alps-resource-descriptor';

export class DefaultDescriptorProvider implements ResourceDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: SchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningResourceDescriptor> {
    return this.schemaService.getJsonSchema(resourceName)
      .combineLatest(this.schemaService.getAlps(resourceName), (jsonSchema, alps) => {
        const descriptors = [];
        if (this.config && this.config.itemConfigs && this.config.itemConfigs[resourceName]) {
          descriptors.push(new StaticResourceDescriptor(resourceName, this.config.itemConfigs[resourceName], this.config.itemConfigs));
        }
        descriptors.push(new JsonSchemaResourceDescriptor(resourceName, jsonSchema, null,
          new SchemaReferenceFactory(jsonSchema.definitions)),
          new AlpsResourceDescriptor(alps.getRepresentationDescriptor().descriptor, alps.getAllDescriptors().map(d => d.descriptor)));
        return new CombiningResourceDescriptor(descriptors);
      });
  }
}
