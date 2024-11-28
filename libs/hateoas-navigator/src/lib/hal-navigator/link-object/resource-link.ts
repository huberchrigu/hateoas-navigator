import {HalResourceObject} from '../hal-resource';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {LinkObject} from './link-object';
import {Observable} from 'rxjs';
import {GenericPropertyDescriptor} from '../descriptor';
import {RelativeLink} from './relative-link';
import {AbsoluteLink} from './absolute-link';

/**
 * Represents a link to a resource and provides various functions to get information from this link. A resource link has a
 * {@link getRelationType() relation type (e.g. 'self')} and its href may look as follows:
 *
 * <table>
 * <tr>
 *   <th>{@link getHref href}</th>
 *   <th>{@link toAbsoluteLink Absolute link}</th>
 *   <th>{@link toRelativeLink Relative link}</th>
 *   <th>{@link getResourceName Resource name}</th>
 *   <th>{@link getResourceId Resource ID}</th>
 *   <th>{@link getTemplatedParams Templated parameters}</th>
 * </tr>
 * <tr><td>http://service/resources</td><td>http://service/resources</td><td>/resources</td><td>resources</td><td>-</td><td>-</td></tr>
 * <tr><td>http://service/resources/id</td><td>http://service/resources/id</td><td>/resources/id</td><td>resources</td><td>id</td>
 *   <td>-</td></tr>
 * <tr><td>http://service/resources{?param1,param2}</td><td>http://service/resources</td><td>/resources</td><td>resources</td><td>-</td>
 *   <td>[param1,param2]</td></tr>
 * </table>
 *
 * <b>Important:</b> Only query parameters are supported in templated URIs. Other parts of the
 * <a href="https://tools.ietf.org/html/rfc6570">spec</a> are not supported yet.
 */
export class ResourceLink {

  constructor(private linkRelationType: string, private link: LinkObject, private resourceDescriptorResolver?: ResourceDescriptorProvider) {
  }

  static fromResourceObject(resourceObject: HalResourceObject, resourceDescriptorResolver?: ResourceDescriptorProvider) {
    return new ResourceLink('self', resourceObject._links!.self, resourceDescriptorResolver);
  }

  static linkFromId(resource: string, id: string): RelativeLink {
    return new RelativeLink('/' + resource + '/' + id);
  }

  private static stringifyDate(value: string | Date) {
    return (value as Date).toJSON ? (value as Date).toJSON() : value;
  }

  getHref(): string {
    return this.link.href;
  }

  getRelationType(): string {
    return this.linkRelationType;
  }

  getResourceName(): string {
    const relativeUrl = this.toRelativeLink().getUri();
    const resourceUrl = relativeUrl.substring(1);
    const secondSlashIndex = resourceUrl.indexOf('/');
    if (secondSlashIndex > -1) {
      return resourceUrl.substring(0, secondSlashIndex);
    }
    return resourceUrl;
  }

  getResourceId(): string {
    const relativeUrl = this.toRelativeLink().getUri().substring(1);
    const slashIndex = relativeUrl.indexOf('/');
    if (slashIndex < 0) {
      throw Error(`${this.getHref()} contains no resource ID`);
    }
    return relativeUrl.substring(slashIndex + 1);
  }

  toAbsoluteLink(): AbsoluteLink {
    return new AbsoluteLink(this.removeTemplatedParams());
  }

  toRelativeLink(): RelativeLink {
    return this.toAbsoluteLink().toRelativeLink();
  }

  getResourceDescriptor(): Observable<GenericPropertyDescriptor> {
    return this.resourceDescriptorResolver!.resolve(this.getResourceName());
  }

  /**
   * Extracts forGroup and calendarEntry from
   * http://localhost:8080/suggestions/search/findByForGroupAndCalendarEntry{?forGroup,calendarEntry}
   */
  getTemplatedParams(): string[] {
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
  replaceTemplatedParams(values: { [param: string]: string | Date }): ResourceLink {
    const params = this.getTemplatedParams()
      .filter(param => values[param])
      .map(param => param + '=' + ResourceLink.stringifyDate(values[param]));
    let newHref = this.removeTemplatedParams();
    if (params.length > 0) {
      newHref = newHref + '?' + params.reduce((a, b) => a + '&' + b);
    }
    return new ResourceLink(this.linkRelationType, {href: newHref, templated: false}, this.resourceDescriptorResolver);
  }

  private removeTemplatedParams(): string {
    if (this.link.templated) {
      const indexOfFirstBracket = this.getHref().indexOf('{');
      return this.getHref().substring(0, indexOfFirstBracket);
    }
    return this.getHref();
  }
}
