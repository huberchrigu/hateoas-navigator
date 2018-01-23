import {AlpsDescriptor} from '@hal-navigator/alps-document/alps-descriptor';
import {Link} from '@hal-navigator/link-object/link';
import {AlpsDescriptorType} from '@hal-navigator/alps-document/alps-descriptor-type';

export class AlpsDescriptorAdapter {
  private static readonly PROFILE_PREFIX = '/profile/';

  constructor(public descriptor: AlpsDescriptor) {
  }

  getName(): string {
    return this.descriptor.name;
  }

  getDescriptors(): AlpsDescriptorAdapter[] {
    const children = this.descriptor.descriptors;
    if (children) {
      return children.map(d => new AlpsDescriptorAdapter(d));
    } else {
      return [];
    }
  }

  getCollectionResourceName(): string {
    if (this.descriptor.type !== AlpsDescriptorType.SAFE) {
      throw new Error('A collection resource must be of type SAFE');
    }
    const link = new Link(this.descriptor.rt);
    const profileUri = link.getRelativeUri();
    const uriWithoutProfile = profileUri.substring(AlpsDescriptorAdapter.PROFILE_PREFIX.length);
    const indexOfHash = uriWithoutProfile.indexOf('#');
    return uriWithoutProfile.substring(0, indexOfHash);
  }

  getId() {
    return this.descriptor.id;
  }
}
