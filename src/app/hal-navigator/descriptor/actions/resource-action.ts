import {ActionType} from '@hal-navigator/descriptor/actions/action-type';

export class ResourceAction {
  constructor(private type: ActionType, private enabled) {

  }

  getType(): ActionType {
    return this.type;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
