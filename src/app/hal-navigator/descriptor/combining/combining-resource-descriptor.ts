import {CombiningPropertyDescriptor} from '@hal-navigator/descriptor/combining/combining-property-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ResourceActions} from '@hal-navigator/descriptor/actions/resource-actions';
import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';

export class CombiningResourceDescriptor extends CombiningPropertyDescriptor implements ResourceDescriptor {
  private resourceDescriptors: ResourceDescriptor[];

  constructor(priorityList: Array<PropertyDescriptor>) {
    super(priorityList);

    this.resourceDescriptors = priorityList.map(d => d as any as ResourceDescriptor).filter(d => d.getActions);
  }

  getActions(): ResourceActions {
    return this.resourceDescriptors
      .filter(d => d.getActions())
      .reduce((previous, current) => previous.include(current.getActions()), new ResourceActions([]));
  }

  getChildResourceDesc(childResource: string): ResourceDescriptor {
    const children = this.resourceDescriptors.map(d => d.getChildResourceDesc(childResource)).filter(d => d);
    return children.length > 0 ? new CombiningResourceDescriptor(children) : null;
  }
}
