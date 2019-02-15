import {ResourceDescriptorProvider} from './resource-descriptor-provider';
import {ModuleConfiguration} from '../../config';
import {ResourceSchemaService} from '../../resource-services/resource-schema.service';
import {combineLatest, Observable} from 'rxjs';
import {CombiningResourceDescriptor} from '../combining/combining-resource-descriptor';
import {StaticResourceDescriptor} from '../static/static-resource-descriptor';
import {JsonSchemaResourceDescriptor} from '../json-schema/json-schema-resource-descriptor';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {AlpsResourceDescriptor} from '../alps/alps-resource-descriptor';
import {AlpsDocumentAdapter} from '../../alps-document/alps-document-adapter';
import {JsonSchemaDocument} from '../../schema/json-schema';
import {DeprecatedPropertyDescriptor} from '../deprecated-property-descriptor';
import {map} from 'rxjs/operators';
import {AlpsDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/alps/alps-descriptor-mapper';
import {DescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-mapper';
import {CombiningDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/combining/combining-descriptor-mapper';
import {StaticDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/static/static-descriptor-mapper';
import {JsonSchemaDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/json-schema/json-schema-descriptor-mapper';
import {ResourceDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/deprecated-resource-descriptor';

/**
 * Combines {@link StaticResourceDescriptor static configuration}, {@link JsonSchemaResourceDescriptor JsonSchema} and {@link AlpsResourceDescriptor ALPS}
 * to describe a resource.
 */
export class DeprecatedDescriptorProvider implements ResourceDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: ResourceSchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningResourceDescriptor> {
    return combineLatest(this.schemaService.getJsonSchema(resourceName), this.schemaService.getAlps(resourceName))
      .pipe(
        map(([jsonSchema, alps]) => this.assembleDescriptors(resourceName, jsonSchema, alps)),
        map(descriptors => new CombiningResourceDescriptor(descriptors))
      );
  }

  private assembleDescriptors(resourceName: string, jsonSchema: JsonSchemaDocument, alps: AlpsDocumentAdapter): DeprecatedPropertyDescriptor[] {
    const descriptors: DeprecatedPropertyDescriptor[] = [];
    if (this.isStaticConfigurationAvailable(resourceName)) {
      descriptors.push(new StaticResourceDescriptor(resourceName, this.config.itemConfigs[resourceName], this.config.itemConfigs));
    }
    descriptors.push(
      new JsonSchemaResourceDescriptor(resourceName, jsonSchema, null, new SchemaReferenceFactory(jsonSchema.definitions)),
      new AlpsResourceDescriptor(alps.getRepresentationDescriptor().descriptor, alps.getAllDescriptors().map(d => d.descriptor))
    );
    return descriptors;
  }

  private isStaticConfigurationAvailable(resourceName: string): boolean {
    return this.config && this.config.itemConfigs && !!this.config.itemConfigs[resourceName];
  }
}

export class DefaultDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: ResourceSchemaService) {

  }

  resolve(resourceName: string): Observable<ResourceDescriptor> {
    return combineLatest(this.schemaService.getJsonSchema(resourceName), this.schemaService.getAlps(resourceName))
      .pipe(
        map(([jsonSchema, alps]) => this.assembleDescriptorBuilders(resourceName, jsonSchema, alps).map(builder => builder.toDescriptor())),
        map(descriptors => new CombiningDescriptorMapper(descriptors).toDescriptor() as ResourceDescriptor)
      );
  }

  private assembleDescriptorBuilders(resourceName: string, jsonSchema: JsonSchemaDocument, alps: AlpsDocumentAdapter): DescriptorMapper<any>[] {
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
