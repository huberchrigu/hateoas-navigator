/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
import {Link} from './link';
import {HalResource} from '../hal-resource/hal-resource';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {LinkObject} from './link-object';
import {Observable} from 'rxjs';
import {PropertyDescriptor} from '../descriptor';

export class ResourceLink extends Link {
  static fromResourceObject(resourceObject: HalResource, resourceDescriptorResolver: ResourceDescriptorProvider) {
    return new ResourceLink('self', resourceObject._links.self, resourceDescriptorResolver);
  }

  static relativeUriFromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }

  static extractIdFromUri(resource: string, uri: string) {
    const resourcePrefix = '/' + resource + '/';
    if (!uri.startsWith(resourcePrefix)) {
      throw new Error(`Cannot extract ID from uri ${uri} and resource name ${resource}`);
    }
    const afterResource = uri.substring(resourcePrefix.length);
    const indexSlash = afterResource.indexOf('/');
    return indexSlash > -1 ? afterResource.substring(0, indexSlash) : afterResource;
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
