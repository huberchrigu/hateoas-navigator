import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {AlpsDescriptor} from '@hal-navigator/alp-document/alps-descriptor';

export class AlpsResourceDescriptor implements ResourceDescriptor {
  constructor(private alps: AlpsDescriptor) {
  }

  getTitle(): string {
    return undefined;
  }

  getName(): string {
    return this.alps.name;
  }

  getChild(resourceName: string): ResourceDescriptor {
    const descriptor = this.alps.descriptors.find(d => d.name === resourceName);
    return descriptor ? new AlpsResourceDescriptor(descriptor) : null;
  }

  getChildren(): Array<ResourceDescriptor> {
    return this.alps.descriptors.map(d => new AlpsResourceDescriptor(d));
  }
}
