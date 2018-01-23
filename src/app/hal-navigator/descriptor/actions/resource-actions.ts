import {ResourceAction} from '@hal-navigator/descriptor/actions/resource-action';
import {ActionType} from '@hal-navigator/descriptor/actions/action-type';

export class ResourceActions {
  constructor(private actions: Array<ResourceAction>) {
  }

  getAll() {
    return this.actions;
  }

  isCreateEnabled(): boolean {
    return this.actions.some(a => a.getType() === ActionType.CREATE_ITEM);
  }

  isDeleteEnabled(): boolean {
    return this.actions.some(a => a.getType() === ActionType.DELETE_ITEM);
  }

  isUpdateEnabled(): boolean {
    return this.actions.some(a => a.getType() === ActionType.UPDATE_ITEM);
  }

  isGetItemEnabled(): boolean {
    return this.actions.some(a => a.getType() === ActionType.GET_ITEM);
  }

  isGetCollectionEnabled(): boolean {
    return this.actions.some(a => a.getType() === ActionType.GET_COLLECTION);
  }

  /**
   * Add all actions that are not available yet.
   */
  include(other: ResourceActions) {
    other.getAll().filter(a => !this.actions.some(b => a.getType() === b.getType()))
      .forEach(a => this.actions.push(a));
    return this;
  }

  private isEnabled(type: ActionType) {
    const action = this.actions.find(a => a.getType() === type);
    return action ? action.isEnabled() : false;
  }
}
