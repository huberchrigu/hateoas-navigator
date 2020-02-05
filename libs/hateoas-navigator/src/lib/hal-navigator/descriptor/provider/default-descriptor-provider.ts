import {ModuleConfiguration} from '../../config';
import {ResourceSchemaService} from '../../resource-services/resource-schema.service';
import {combineLatest, Observable} from 'rxjs';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {AlpsDocumentAdapter} from '../../alps-document/alps-document-adapter';
import {JsonSchemaDocument} from '../../schema/json-schema';
import {map} from 'rxjs/operators';
import {AlpsDescriptorMapper} from '../alps/alps-descriptor-mapper';
import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {CombiningDescriptorMapper} from '../combining/combining-descriptor-mapper';
import {StaticDescriptorMapper} from '../static/static-descriptor-mapper';
import {JsonSchemaDescriptorMapper} from '../json-schema/json-schema-descriptor-mapper';
import {ResourceObjectDescriptor} from '../resource-object-descriptor';
import {DefaultMapperConfigs} from '../combining/mapper-config';

export class DefaultDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: ResourceSchemaService) {

  }

  resolve(resourceName: string): Observable<ResourceObjectDescriptor> {
    return combineLatest([this.schemaService.getJsonSchema(resourceName), this.schemaService.getAlps(resourceName)])
      .pipe(
        map(([jsonSchema, alps]) => this.assembleDescriptorBuilders(resourceName, jsonSchema, alps)),
        map(descriptorMappers => new CombiningDescriptorMapper(descriptorMappers, DefaultMapperConfigs.ignoreChildrenFromAlps())
          .toDescriptor() as ResourceObjectDescriptor)
      );
  }

  private assembleDescriptorBuilders(resourceName: string, jsonSchema: JsonSchemaDocument,
                                     alps: AlpsDocumentAdapter): DescriptorMapper<any>[] {
    const descriptors: DescriptorMapper<any>[] = [];
    if (this.isStaticConfigurationAvailable(resourceName)) {
      descriptors.push(new StaticDescriptorMapper(resourceName, this.config.itemConfigs[resourceName], this.config.itemConfigs));
    }
    descriptors.push(
      new JsonSchemaDescriptorMapper(resourceName, jsonSchema, new SchemaReferenceFactory(jsonSchema.definitions)),
      new AlpsDescriptorMapper(alps.getRepresentationDescriptor().descriptor, alps.getAllDescriptors().map(d => d.descriptor))
    );
    return descriptors;
  }

  private isStaticConfigurationAvailable(resourceName: string): boolean {
    return this.config && this.config.itemConfigs && !!this.config.itemConfigs[resourceName];
  }
}
