import {AssociatedPropertyDescriptor} from './associated-property-descriptor';
import {ResourceDescriptor} from '../resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';

export class AssociatedResourceDescriptor extends AssociatedPropertyDescriptor implements ResourceDescriptor {
  constructor(private resourceDescriptor: ResourceDescriptor, private associatedResourceDesc: AssociatedResourceDescriptor,
              associatedChildren: Array<AssociatedPropertyDescriptor>, associatedArrayItems: AssociatedPropertyDescriptor) {
    super(resourceDescriptor, associatedResourceDesc, associatedChildren, associatedArrayItems);
  }

  getChildResourceDesc(childName: string): ResourceDescriptor {
    if (this.associatedResource) {
      return this.associatedResourceDesc.getChildResourceDesc(childName);
    } else {
      return undefined; // TODO: A resource should have a possible embedded resource.
    }
  }

  getActions(): ResourceActions {
    return this.resourceDescriptor.getActions();
  }

  getDescriptorForLink(uri: string): ResourceDescriptor {
    return this.resourceDescriptor.getDescriptorForLink(uri);
  }
}
