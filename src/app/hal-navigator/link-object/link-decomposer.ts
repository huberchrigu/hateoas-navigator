/**
 * @deprecated
 */
export class DeprecatedLinkDecomposer {
  getResourceName(relativeUrl: string) {
    if (!relativeUrl && !relativeUrl.startsWith('/')) {
      throw new Error('A resource url should start with /, but this one was ' + relativeUrl);
    }
    const resourceUrl = relativeUrl.substring(1);
    const secondSlashIndex = resourceUrl.indexOf('/');
    if (secondSlashIndex > -1) {
      return this.removeOptionalPart(resourceUrl.substring(0, secondSlashIndex));
    }
    return this.removeOptionalPart(resourceUrl);
  }

  private removeOptionalPart(resourceNameWithOptionalPart: string) {
    const optionalPartIndex = resourceNameWithOptionalPart.indexOf('{');
    return optionalPartIndex >= 0 ? resourceNameWithOptionalPart.substring(0, optionalPartIndex) : resourceNameWithOptionalPart;
  }
}
