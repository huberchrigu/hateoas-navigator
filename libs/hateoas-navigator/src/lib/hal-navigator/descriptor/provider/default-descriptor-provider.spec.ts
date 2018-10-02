import {async} from '@angular/core/testing';
import {SchemaService} from '../../resource-services/schema.service';
import {JsonSchema, JsonSchemaDocument} from '../../schema/json-schema';
import {of} from 'rxjs/index';
import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from '../../alps-document/alps-descriptor-adapter';
import {AlpsDocumentAdapter} from '../../alps-document/alps-document-adapter';
import {DefaultDescriptorProvider} from './default-descriptor-provider';
import {ModuleConfiguration} from '../../config';

describe('DefaultDescriptorProvider', () => {
  const schemaService = jasmine.createSpyObj<SchemaService>('schemaService', [
    'getJsonSchema', 'getAlps'
  ]);
  const schema = {
    title: 'A',
    type: 'object',
    properties: {
      b: {
        title: 'B',
        type: 'string'
      } as JsonSchema
    }
  } as JsonSchemaDocument;
  schemaService.getJsonSchema.and.returnValue(of(schema));
  const alpsDescriptor = {
    descriptor: {
      id: 'resource-representation',
      descriptors: []
    } as AlpsDescriptor
  } as AlpsDescriptorAdapter;
  schemaService.getAlps.and.returnValue(of({
    getRepresentationDescriptor: () => alpsDescriptor,
    getAllDescriptors: () => [alpsDescriptor]
  } as AlpsDocumentAdapter));

  it('should resolve titles', async(() => {
    const testee = new DefaultDescriptorProvider({} as ModuleConfiguration, schemaService);
    testee.resolve('a').subscribe(desc => {
      expect(schemaService.getJsonSchema).toHaveBeenCalledWith('a');
      expect(desc.getTitle()).toEqual('A');
      expect(desc.getChildDescriptor('b').getTitle()).toEqual('B');
    });
  }));
});