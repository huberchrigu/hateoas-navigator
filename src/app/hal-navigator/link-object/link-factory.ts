import {ResourceLinks} from '@hal-navigator/resource-object/resource-links';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';

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
      return new ResourceLink(linkRelationType, link);
    } else {
      throw new Error(`Link ${linkRelationType} does not exist`);
    }
  }
}
