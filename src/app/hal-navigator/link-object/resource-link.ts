/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
import {DeprecatedLinkDecomposer} from '@hal-navigator/link-object/link-decomposer';

export class ResourceLink {
  private static SUPPORTED_PROTOCOLS = ['http://', 'https://'];

  constructor(private linkRelationType: string, private href: string) {

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

  /**
   * 'relative' means without protocol/domain.
   */
  private getRelativeUri() {
    const protocol = this.getProtocol();
    if (!protocol) {
      return this.href;
    }
    return this.getUriAfterDomain(this.href.substring(protocol.length));
  }

  private getProtocol() {
    for (const p of ResourceLink.SUPPORTED_PROTOCOLS) {
      if (this.href.startsWith(p)) {
        return p;
      }
    }
    return null;
  }

  private getUriAfterDomain(uriAfterProtocol: string) {
    const indexOfFirstSlash = uriAfterProtocol.indexOf('/');
    if (indexOfFirstSlash >= 0) {
      return uriAfterProtocol.substring(indexOfFirstSlash);
    }
    return uriAfterProtocol;
  }
}
