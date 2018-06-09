import {Required, Validate} from '../../../decorators/required';
import {AlpsPropertyDescriptor} from './alps-property-descriptor';
import {ResourceDescriptor} from '../resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';
import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {ResourceAction} from '../actions/resource-action';
import {ActionType} from '../actions/action-type';

export class AlpsResourceDescriptor extends AlpsPropertyDescriptor implements ResourceDescriptor {
  private actions: ResourceActions;

  constructor(representation: AlpsDescriptor, allDescriptors: AlpsDescriptor[]) {
    super(representation);
    this.actions = this.toActions(allDescriptors);
  }

  getActions(): ResourceActions {
    return this.actions;
  }

  getChildResourceDesc(childName: string) {
    const childDesc = this.findDescriptor(childName);
    return childDesc ? this.toResourceDesc(childDesc) : null;
  }

  private toResourceDesc(descriptor: AlpsDescriptor): AlpsResourceDescriptor {
    return new AlpsResourceDescriptor(descriptor, [descriptor]);
  }

  private toActions(descriptors: AlpsDescriptor[]) {
    const actions: Array<ResourceAction> = [];
    const resourceName = this.getName();
    const descriptorIds = descriptors.map(d => d.id);
    descriptorIds
      .filter(id => id)
      .forEach(id => {
      const action = this.toAction(id, resourceName);
      if (action) {
        actions.push(action);
      }
    });
    return new ResourceActions(actions);
  }

  @Validate
  private toAction(@Required descriptorId: string, resourceName: string) {
    switch (descriptorId) {
      case 'get-' + resourceName:
        return new ResourceAction(ActionType.GET_ITEM, true);
      case 'delete-' + resourceName:
        return new ResourceAction(ActionType.DELETE_ITEM, true);
      case 'update-' + resourceName:
        return new ResourceAction(ActionType.UPDATE_ITEM, true);
    }
    if (descriptorId.startsWith('get-' + resourceName)) {
      return new ResourceAction(ActionType.GET_COLLECTION, true);
    }
    if (descriptorId.startsWith('create-' + resourceName)) {
      return new ResourceAction(ActionType.CREATE_ITEM, true);
    }
    return null;
  }
}
