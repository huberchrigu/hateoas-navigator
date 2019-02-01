import {ResourceDescriptorProvider} from './resource-descriptor-provider';
import {ModuleConfiguration} from '../../config';
import {ResourceSchemaService} from '../../resource-services/resource-schema.service';
import {combineLatest, Observable} from 'rxjs/index';
import {CombiningResourceDescriptor} from '../combining/combining-resource-descriptor';
import {StaticResourceDescriptor} from '../static/static-resource-descriptor';
import {JsonSchemaResourceDescriptor} from '../json-schema/json-schema-resource-descriptor';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {AlpsResourceDescriptor} from '../alps/alps-resource-descriptor';
import {AlpsDocumentAdapter} from '../../alps-document/alps-document-adapter';
import {JsonSchemaDocument} from '../../schema/json-schema';
import {PropertyDescriptor} from '../property-descriptor';
import {map} from 'rxjs/operators';

/**
 * Combines {@link StaticResourceDescriptor static configuration}, {@link JsonSchemaResourceDescriptor JsonSchema} and {@link AlpsResourceDescriptor ALPS}
 * to describe a resource.
 */
export class DefaultDescriptorProvider implements ResourceDescriptorProvider {

  constructor(private config: ModuleConfiguration, private schemaService: ResourceSchemaService) {

  }

  resolve(resourceName: string): Observable<CombiningResourceDescriptor> {
    return combineLatest(this.schemaService.getJsonSchema(resourceName), this.schemaService.getAlps(resourceName))
      .pipe(
        map(([jsonSchema, alps]) => this.assembleDescriptors(resourceName, jsonSchema, alps)),
        map(descriptors => new CombiningResourceDescriptor(descriptors))
      );
  }

  private assembleDescriptors(resourceName: string, jsonSchema: JsonSchemaDocument, alps: AlpsDocumentAdapter): PropertyDescriptor[] {
    const descriptors: PropertyDescriptor[] = [];
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
