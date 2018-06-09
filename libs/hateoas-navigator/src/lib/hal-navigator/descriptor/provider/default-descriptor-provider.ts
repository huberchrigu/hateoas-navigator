import {ResourceDescriptorProvider} from './resource-descriptor-provider';
import {ModuleConfiguration} from '../../config';
import {SchemaService} from '../../resource-services/schema.service';
import {Observable} from 'rxjs/index';
import {CombiningResourceDescriptor} from '../combining/combining-resource-descriptor';
import {StaticResourceDescriptor} from '../static/static-resource-descriptor';
import {JsonSchemaResourceDescriptor} from '../json-schema/json-schema-resource-descriptor';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {AlpsResourceDescriptor} from '../alps/alps-resource-descriptor';
import {combineLatest} from 'rxjs/operators';

export class DefaultDescriptorProvider implements ResourceDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: SchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningResourceDescriptor> {
    return this.schemaService.getJsonSchema(resourceName).pipe(
      combineLatest(this.schemaService.getAlps(resourceName), (jsonSchema, alps) => {
        const descriptors = [];
        if (this.config && this.config.itemConfigs && this.config.itemConfigs[resourceName]) {
          descriptors.push(new StaticResourceDescriptor(resourceName, this.config.itemConfigs[resourceName], this.config.itemConfigs));
        }
        descriptors.push(new JsonSchemaResourceDescriptor(resourceName, jsonSchema, null,
          new SchemaReferenceFactory(jsonSchema.definitions)),
          new AlpsResourceDescriptor(alps.getRepresentationDescriptor().descriptor, alps.getAllDescriptors().map(d => d.descriptor)));
        return new CombiningResourceDescriptor(descriptors);
      }));
  }
}
