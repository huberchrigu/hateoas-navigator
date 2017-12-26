import {CombiningDescriptor} from '@hal-navigator/descriptor/combining-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {AlpsResourceDescriptor} from '@hal-navigator/descriptor/alps-resource-descriptor';
import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema-descriptor';
import SpyObj = jasmine.SpyObj;

describe('CombiningDescriptor', () => {
  it('should group all children by name', () => {
    const testee = new CombiningDescriptor([
      {
        getChildren: () => [
          mockDescriptor('A'),
          mockDescriptor('B')
        ]
      } as ResourceDescriptor,
      {
        getChildren: () => [
          mockDescriptor('B'),
          mockDescriptor('C')
        ]
      } as ResourceDescriptor
    ]);
    const result = testee.getChildren();
    expect(result.length).toBe(3);
    expectChild(result[0], 1, 'A');
    expectChild(result[1], 2, 'B');
    expectChild(result[2], 1, 'C');

    function expectChild(descriptor: ResourceDescriptor, expectedListLength: number, expectedName: string) {
      expect(descriptor['priorityList'].length).toBe(expectedListLength);
      expect(descriptor.getName()).toBe(expectedName);
    }

    function mockDescriptor(name: string): ResourceDescriptor {
      return {getName: () => name} as ResourceDescriptor;
    }
  });

  it('should resolve all associations', () => {
    const associatedResourceName = 'resource';
    const parentResourceName = 'parent';
    const childPropertyName = 'association';

    const alpsChild = mockAlpsDescriptor('alpsChild', associatedResourceName, [], childPropertyName);
    const alpsParent = mockAlpsDescriptor('alpsParent', null, [alpsChild], parentResourceName);

    const jsonSchemaChild = mockJsonSchema('jsonSchemaChild', [], childPropertyName);
    const jsonSchemaParent = mockJsonSchema('jsonSchemaParent', [jsonSchemaChild], parentResourceName);

    const testee = new CombiningDescriptor([
      alpsParent, jsonSchemaParent
    ]);

    testee.resolveAssociations().subscribe(() => {
      expect(alpsParent.resolveAssociatedResourceName).toHaveBeenCalled();
      expect(alpsParent.getChildren).toHaveBeenCalled();
      expect(jsonSchemaParent.getChildren).toHaveBeenCalled();

      expect(alpsChild.resolveAssociatedResourceName).toHaveBeenCalled();
      expect(alpsChild.notifyAssociatedResource).toHaveBeenCalledWith(associatedResourceName);
      expect(alpsChild.resolveAssociation).toHaveBeenCalled();
      expect(jsonSchemaChild.notifyAssociatedResource).toHaveBeenCalledWith(associatedResourceName);
      expect(jsonSchemaChild.resolveAssociation).toHaveBeenCalled();
    });

    function mockAlpsDescriptor(mockName: string, resolvedResourceName: string, children: Array<AlpsResourceDescriptor>,
                                resourceName: string): SpyObj<AlpsResourceDescriptor> {
      const desc = jasmine.createSpyObj<AlpsResourceDescriptor>(mockName, ['getChildren',
        'resolveAssociatedResourceName', 'notifyAssociatedResource', 'getName', 'resolveAssociation']);
      desc.resolveAssociatedResourceName.and.returnValue(resolvedResourceName);
      desc.getChildren.and.returnValue(children);
      desc.getName.and.returnValue(resourceName);
      return desc;
    }

    function mockJsonSchema(mockName: string, children: Array<JsonSchemaDescriptor>,
                            resourceName: string): SpyObj<JsonSchemaDescriptor> {
      const desc = jasmine.createSpyObj<JsonSchemaDescriptor>(mockName, ['getChildren',
        'notifyAssociatedResource', 'getName', 'resolveAssociation']);
      desc.getChildren.and.returnValue(children);
      desc.getName.and.returnValue(resourceName);
      return desc;
    }
  });
});
