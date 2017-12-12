import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

/**
 * Accepts a list of resource descriptors. Each request is forward to any item of this list.
 * The first defined is returned.
 */
export class CombiningDescriptor implements ResourceDescriptor {
  constructor(private priorityList: Array<ResourceDescriptor>) {
  }

  getTitle(): string {
    return this.getFirstResult(d => d.getTitle());
  }

  getName(): string {
    return this.getFirstResult(d => d.getName());
  }

  getChild(resourceName: string): ResourceDescriptor {
    return new CombiningDescriptor(this.priorityList
      .map(d => d.getChild(resourceName))
      .filter(d => d));
  }

  getChildren(): ResourceDescriptor[] {
    const childrenByName: { [name: string]: ResourceDescriptor[] } = this.priorityList
      .map(d => d.getChildren())
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => this.pushToArrayGivenByName(children, child), {});
    return Object.keys(childrenByName)
      .map(key => new CombiningDescriptor(childrenByName[key]));
  }

  private getFirstResult<T>(f: (d: ResourceDescriptor) => T): T {
    for (const d of this.priorityList) {
      const result = f(d);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private pushToArrayGivenByName(descriptorsByName: { [name: string]: ResourceDescriptor[] },
                                 newDescriptor: ResourceDescriptor) {
    const descriptors = descriptorsByName[newDescriptor.getName()];
    if (descriptors) {
      descriptors.push(newDescriptor);
    } else {
      descriptorsByName[newDescriptor.getName()] = [newDescriptor];
    }
    return descriptorsByName;
  }
}
