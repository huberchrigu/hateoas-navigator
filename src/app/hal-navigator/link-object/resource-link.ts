/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
import {DeprecatedLinkDecomposer} from '@hal-navigator/link-object/link-decomposer';
import {Link} from '@hal-navigator/link-object/link';
import {LinkObject} from '@hal-navigator/link-object/link-object';

export class ResourceLink extends Link {

  constructor(private linkRelationType: string, private link: LinkObject) {
    super(link.href);
  }

  getRelationType() {
    return this.linkRelationType;
  }

  getHref() {
    return this.href;
  }

  extractResourceName(): string {
    return new DeprecatedLinkDecomposer().getResourceName(this.getRelativeUri());
  }

  getFullUriWithoutTemplatedPart() {
    if (this.link.templated) {
      const indexOfFirstBracket = this.href.indexOf('{');
      return this.href.substring(0, indexOfFirstBracket);
    }
    return this.href;
  }
}
