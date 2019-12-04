import {RelativeLink} from 'hateoas-navigator/hal-navigator/link-object/relative-link';

export class AbsoluteLink extends RelativeLink {

  constructor(href: string) {
    super(href);
  }

  private static SUPPORTED_PROTOCOLS = ['http://', 'https://'];

  private static getUriAfterDomain(uriAfterProtocol: string) {
    const indexOfFirstSlash = uriAfterProtocol.indexOf('/');
    if (indexOfFirstSlash >= 0) {
      return uriAfterProtocol.substring(indexOfFirstSlash);
    }
    return uriAfterProtocol;
  }

  /**
   * 'relative' means without protocol/domain.
   */
  toRelativeLink(): RelativeLink {
    const protocol = this.getProtocol();
    if (!protocol) {
      throw new Error(`${this.getUri()} seems to be already relative`);
    }
    const relativeUri = AbsoluteLink.getUriAfterDomain(this.getUri().substring(protocol.length));
    return new RelativeLink(relativeUri);
  }

  private getProtocol() {
    for (const p of AbsoluteLink.SUPPORTED_PROTOCOLS) {
      if (this.getUri().startsWith(p)) {
        return p;
      }
    }
    return null;
  }
}
