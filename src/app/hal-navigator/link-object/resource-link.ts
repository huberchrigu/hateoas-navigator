import {Link} from '@hal-navigator/link-object/link';
import {LinkObject} from '@hal-navigator/link-object/link-object';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {Observable} from 'rxjs/Observable';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';

/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
export class ResourceLink extends Link {
  static fromResourceObject(resourceObject: ResourceObject, resourceDescriptorResolver: ResourceDescriptorResolver) {
    return new ResourceLink('self', resourceObject._links.self, resourceDescriptorResolver);
  }

  static relativeUriFromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }

  constructor(private linkRelationType: string, private link: LinkObject, private resourceDescriptorResolver: ResourceDescriptorResolver) {
    super(link.href);
  }

  getRelationType() {
    return this.linkRelationType;
  }

  getFullUri() {
    return this.href;
  }

  extractResourceName(): string {
    const relativeUrl = this.getRelativeUri();
    const resourceUrl = relativeUrl.substring(1);
    const secondSlashIndex = resourceUrl.indexOf('/');
    if (secondSlashIndex > -1) {
      return this.removeTemplatedPart(resourceUrl.substring(0, secondSlashIndex));
    }
    return this.removeTemplatedPart(resourceUrl);
  }

  getFullUriWithoutTemplatedPart() {
    return this.removeTemplatedPart(this.href);
  }

  getRelativeUriWithoutTemplatedPart() {
    return this.removeTemplatedPart(this.getRelativeUri());
  }

  getResource(): Observable<VersionedResourceObject> {
    throw new Error('Not implemented yet');
  }

  getResourceDescriptor(): Observable<ResourceDescriptor> {
    return this.resourceDescriptorResolver.resolve(this.extractResourceName());
  }

  private removeTemplatedPart(uri: string) {
    if (this.link.templated) {
      const indexOfFirstBracket = uri.indexOf('{');
      return uri.substring(0, indexOfFirstBracket);
    }
    return uri;
  }
}
