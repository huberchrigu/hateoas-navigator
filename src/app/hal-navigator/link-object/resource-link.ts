import {Link} from '@hal-navigator/link-object/link';
import {LinkObject} from '@hal-navigator/link-object/link-object';
import {HalResource} from '@hal-navigator/hal-resource/hal-resource';
import {Observable} from 'rxjs/Observable';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';
import {ResourceDescriptorProvider} from '@hal-navigator/descriptor/provider/resource-descriptor-provider';

/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
export class ResourceLink extends Link {
  static fromResourceObject(resourceObject: HalResource, resourceDescriptorResolver: ResourceDescriptorProvider) {
    return new ResourceLink('self', resourceObject._links.self, resourceDescriptorResolver);
  }

  static relativeUriFromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }

  constructor(private linkRelationType: string, private link: LinkObject, private resourceDescriptorResolver: ResourceDescriptorProvider) {
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

  getResource(): Observable<VersionedResourceAdapter> {
    throw new Error('Not implemented yet');
  }

  getResourceDescriptor(): Observable<PropertyDescriptor> {
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
