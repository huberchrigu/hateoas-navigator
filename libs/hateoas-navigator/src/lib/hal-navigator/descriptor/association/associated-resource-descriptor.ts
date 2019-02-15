import {AssociatedPropertyDescriptor} from './associated-property-descriptor';
import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';

export class AssociatedResourceDescriptor extends AssociatedPropertyDescriptor implements DeprecatedResourceDescriptor {
  constructor(private resourceDescriptor: DeprecatedResourceDescriptor, private associatedResourceDesc: AssociatedResourceDescriptor,
              associatedChildren: Array<AssociatedResourceDescriptor>, associatedArrayItems: AssociatedResourceDescriptor) {
    super(resourceDescriptor, associatedResourceDesc, associatedChildren, associatedArrayItems);
  }

  getActions(): ResourceActions {
    return this.resourceDescriptor.getActions();
  }

  getDescriptorForLink(uri: string): DeprecatedResourceDescriptor {
    return this.resourceDescriptor.getDescriptorForLink(uri);
  }
}
