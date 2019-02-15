import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';
import {CombiningPropertyDescriptor} from './combining-property-descriptor';
import {DeprecatedPropertyDescriptor} from '../deprecated-property-descriptor';

export class CombiningResourceDescriptor extends CombiningPropertyDescriptor implements DeprecatedResourceDescriptor {
  private resourceDescriptors: DeprecatedResourceDescriptor[];

  constructor(priorityList: Array<DeprecatedPropertyDescriptor>) {
    super(priorityList);

    this.resourceDescriptors = priorityList.map(d => d as any as DeprecatedResourceDescriptor).filter(d => d.getActions);
  }

  getActions(): ResourceActions {
    return this.resourceDescriptors
      .filter(d => d.getActions())
      .reduce((previous, current) => previous.include(current.getActions()), new ResourceActions([]));
  }

  getDescriptorForLink(uri: string): DeprecatedResourceDescriptor {
    return this.extractDescriptor(this.resourceDescriptors, d => d.getDescriptorForLink(uri));
  }
}
