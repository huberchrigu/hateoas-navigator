import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

describe('ResourceProperty', () => {
  it('should transform an array to a display value', () => {
    const testee = new ResourceProperty('array', [
      {
        'property': 'test'
      }]);

    expect(testee.getDisplayValue()).toEqual('property: test');
  });
});