import {ResourceProperty} from 'app/hal-navigator/hal-resource/property/resource-property';

describe('ResourceProperty', () => {
  it('should transform an array to a display value', () => {
    const testee = new ResourceProperty('array', [
      {
        'property': 'test'
      }], null);

    expect(testee.getDisplayValue()).toEqual('property: test');
  });
});
