import {CombiningDescriptor} from '@hal-navigator/descriptor/combining-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

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
  });

  function expectChild(descriptor: ResourceDescriptor, expectedListLength: number, expectedName: string) {
    expect(descriptor['priorityList'].length).toBe(expectedListLength);
    expect(descriptor.getName()).toBe(expectedName);
  }

  function mockDescriptor(name: string): ResourceDescriptor {
    return {getName: () => name} as ResourceDescriptor;
  }
});
