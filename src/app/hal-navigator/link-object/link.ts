export class Link {
  private static SUPPORTED_PROTOCOLS = ['http://', 'https://'];

  constructor(protected href: string) {
  }

  /**
   * 'relative' means without protocol/domain.
   */
  getRelativeUri() {
    const protocol = this.getProtocol();
    if (!protocol) {
      return this.href;
    }
    return this.getUriAfterDomain(this.href.substring(protocol.length));
  }

  private getProtocol() {
    for (const p of Link.SUPPORTED_PROTOCOLS) {
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
