import {ResourceLink} from '@hal-navigator/link-object/resource-link';

describe('ResourceLink', () => {
  it('should extract the resource name from a full URL', () => {
    const testee = new ResourceLink('does-not-matter', {'href': 'http://localhost:4200/users/123'});
    expect(testee.extractResourceName()).toEqual('users');
  });
});
