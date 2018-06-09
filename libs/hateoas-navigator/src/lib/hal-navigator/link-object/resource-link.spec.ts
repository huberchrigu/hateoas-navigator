import {ResourceLink} from './resource-link';

describe('ResourceLink', () => {
  it('should extract the resource name from a full URL', () => {
    const testee = new ResourceLink('does-not-matter', {'href': 'http://localhost:4200/users/123'}, undefined);
    expect(testee.extractResourceName()).toEqual('users');
  });
});
