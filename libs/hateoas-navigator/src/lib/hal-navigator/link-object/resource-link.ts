/**
 * Represents a link to a resource and provides various functions to get information from this link.
 */
import {Link} from './link';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {LinkObject} from './link-object';
import {Observable} from 'rxjs';
import {PropDescriptor} from '../descriptor';

export class ResourceLink extends Link {

  constructor(private linkRelationType: string, private link: LinkObject, private resourceDescriptorResolver: ResourceDescriptorProvider) {
    super(link.href);
  }

  static fromResourceObject(resourceObject: HalResourceObject, resourceDescriptorResolver: ResourceDescriptorProvider) {
    return new ResourceLink('self', resourceObject._links.self, resourceDescriptorResolver);
  }

  /**
   * @deprecated
   */
  static relativeUriFromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }

  private static stringifyDate(value: string | Date) {
    return (value as Date).toJSON ? (value as Date).toJSON() : value;
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
      return resourceUrl.substring(0, secondSlashIndex);
    }
    return this.removeTemplatedPart(resourceUrl);
  }

  extractId(): string {
    const relativeUrl = this.getRelativeUriWithoutTemplatedPart().substring(1);
    const slashIndex = relativeUrl.indexOf('/');
    return relativeUrl.substring(slashIndex + 1);
  }

  getFullUriWithoutTemplatedPart() {
    return this.removeTemplatedPart(this.href);
  }

  getRelativeUriWithoutTemplatedPart() {
    return this.removeTemplatedPart(this.getRelativeUri());
  }

  getResourceDescriptor(): Observable<PropDescriptor> {
    return this.resourceDescriptorResolver.resolve(this.extractResourceName());
  }

  /**
   * Extracts forGroup and calendarEntry from
   * http://localhost:8080/suggestions/search/findByForGroupAndCalendarEntry{?forGroup,calendarEntry}
   */
  getTemplatedParts() {
    const uri = this.link.href;
    const indexOfFirstBracket = uri.indexOf('{?');
    if (indexOfFirstBracket > -1) {
      const templatedParts = uri.substring(indexOfFirstBracket + 2, uri.length - 1);
      return templatedParts.split(',');
    }
    return [];
  }

  /**
   * @param values Yet only strings, numbers and Dates/Moment are supported
   */
  getRelativeUriWithReplacedTemplatedParts(values: { [param: string]: string | Date }) {
    const parts = this.getTemplatedParts()
      .filter(param => values[param])
      .map(param => param + '=' + ResourceLink.stringifyDate(values[param]));
    if (parts.length > 0) {
      return this.getRelativeUriWithoutTemplatedPart() + '?' + parts.reduce((a, b) => a + '&' + b);
    } else {
      return this.getRelativeUriWithoutTemplatedPart();
    }
  }

  private removeTemplatedPart(uri: string) {
    if (this.link.templated) {
      const indexOfFirstBracket = uri.indexOf('{');
      return uri.substring(0, indexOfFirstBracket);
    }
    return uri;
  }
}
