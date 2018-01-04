import {ResourceLinks} from '@hal-navigator/hal-resource/resource-links';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resolver/resource-descriptor-resolver';

export class LinkFactory {
  static PROFILE_RELATION_TYPE = 'profile';
  static SELF_RELATION_TYPE = 'self';

  constructor(private links: ResourceLinks, private resourceDescriptorResolver: ResourceDescriptorResolver) {

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
      return new ResourceLink(linkRelationType, link, this.resourceDescriptorResolver);
    } else {
      throw new Error(`Link ${linkRelationType} does not exist`);
    }
  }
}
