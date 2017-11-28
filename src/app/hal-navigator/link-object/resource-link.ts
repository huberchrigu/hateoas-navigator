import {Link} from '@hal-navigator/link-object/link';
import {LinkObject} from '@hal-navigator/link-object/link-object';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';

/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
export class ResourceLink extends Link {
  static fromResourceObject(resourceObject: ResourceObject) {
    return new ResourceLink('self', resourceObject._links.self);
  }

  static relativeUriFromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }

  constructor(private linkRelationType: string, private link: LinkObject) {
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
      return this.removeOptionalPart(resourceUrl.substring(0, secondSlashIndex));
    }
    return this.removeOptionalPart(resourceUrl);
  }

  getFullUriWithoutTemplatedPart() {
    if (this.link.templated) {
      const indexOfFirstBracket = this.href.indexOf('{');
      return this.href.substring(0, indexOfFirstBracket);
    }
    return this.href;
  }

  private removeOptionalPart(resourceNameWithOptionalPart: string) {
    const optionalPartIndex = resourceNameWithOptionalPart.indexOf('{');
    return optionalPartIndex >= 0 ? resourceNameWithOptionalPart.substring(0, optionalPartIndex) : resourceNameWithOptionalPart;
  }
}
