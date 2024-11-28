import {ActionType} from './action-type';

export class ResourceAction {
  constructor(private type: ActionType, private enabled: boolean) {

  }

  getType(): ActionType {
    return this.type;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
