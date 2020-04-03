import {ResourceLink} from './resource-link';

describe('ResourceLink', () => {
  it('should extract the resource name from a full URL', () => {
    const testee = new ResourceLink('does-not-matter', {href: 'http://localhost:4200/users/123'}, undefined);
    expect(testee.extractResourceName()).toEqual('users');
  });

  it('should extract the resource name from a full URL with templated part', () => {
    const href = 'http://localhost:4200/users/5c5099bb434b7721c48b691e{?projection}';
    const testee = new ResourceLink('does-not-matter', {href, templated: true}, undefined);
    expect(testee.extractResourceName()).toEqual('users');
  });

  it('should extract the ID from a full URL with templated part', () => {
    const href = 'http://localhost:4200/users/5c5099bb434b7721c48b691e{?projection}';
    const testee = new ResourceLink('does-not-matter', {href, templated: true}, undefined);
    expect(testee.extractId()).toEqual('5c5099bb434b7721c48b691e');
  });
});
