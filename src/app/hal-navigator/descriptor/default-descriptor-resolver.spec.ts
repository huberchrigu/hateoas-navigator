import {DefaultDescriptorResolver} from '@hal-navigator/descriptor/default-descriptor-resolver';
import {async} from '@angular/core/testing';
import {JsonSchema, JsonSchemaDocument} from '@hal-navigator/schema/json-schema';
import {ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {AlpsDocumentAdapter} from '@hal-navigator/alp-document/alps-document-adapter';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';
import {AlpsDescriptor} from '@hal-navigator/alp-document/alps-descriptor';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';

describe('DefaultDescriptorResolver', () => {
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
  schemaService.getJsonSchema.and.returnValue(Observable.of(schema));
  const alpsDescriptor = {
    descriptor: {
      descriptors: []
    } as AlpsDescriptor
  } as AlpsDescriptorAdapter;
  schemaService.getAlps.and.returnValue(Observable.of({
    getRepresentationDescriptor: () => alpsDescriptor
  } as AlpsDocumentAdapter));

  it('should resolve titles', async(() => {
    const testee = new DefaultDescriptorResolver({} as ModuleConfiguration, schemaService);
    testee.resolve('a').subscribe(desc => {
      expect(schemaService.getJsonSchema).toHaveBeenCalledWith('a');
      expect(desc.getTitle()).toEqual('A');
      expect(desc.getChild('b').getTitle()).toEqual('B');
    });
  }));
});
