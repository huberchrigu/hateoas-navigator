import {ResourceObject} from '../resource-object/resource-object';
import {ResourceLinks} from '@hal-navigator/resource-object/resource-links';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';

export class DeprecatedLinkFactory {
  constructor(private prefix = 'http://localhost:4200') { // TODO: Make globally configurable and search for manual link (de)composition
  }

  fromDocument(document: ResourceObject): string {
    const url = document._links.self.href;
    if (url.startsWith(this.prefix)) {
      return url.substring(this.prefix.length);
    }
    throw new Error(url + ' does not start with expected prefix ' + this.prefix);
  }

  fromId(resource: string, id: string): string {
    return '/' + resource + '/' + id;
  }
}

export class LinkFactory {
  static PROFILE_RELATION_TYPE = 'profile';
  static SELF_RELATION_TYPE = 'self';

  constructor(private links: ResourceLinks) {

  }

  getAll(): ResourceLink[] {
    if (this.links) {
      return Object.keys(this.links).map(type => this.getLink(type));
    } else {
      throw new Error('There is no link metadata');
    }
  }

  getLink(linkRelationType: string): ResourceLink {
    const link = this.links[linkRelationType];
    if (link) {
      return new ResourceLink(linkRelationType, link.href);
    } else {
      throw new Error(`Link ${linkRelationType} does not exist`);
    }
  }
}
