import {GenericPropertyDescriptor} from '../descriptor';
import {NotNull} from '../../decorators/not-null';
import {GenericProperty} from './generic-property';

// @dynamic
export abstract class AbstractProperty<V, D extends GenericPropertyDescriptor> implements GenericProperty<V, D> {

  protected constructor(private name: string, private value: V, private descriptor?: D) {
  }

  getName() {
    return this.name;
  }

  @NotNull((obj, args) => `The resource descriptor for ${obj.getName()} must be resolved before it can be used`)
  getDescriptor(): D {
    return this.descriptor;
  }

  getValue(): V {
    return this.value;
  }

  hasDescriptor(): boolean {
    return !!this.descriptor;
  }

  /**
   * Use this internally if null/undefined values are ok.
   */
  protected getDescriptorIfAny(): D {
    return this.descriptor;
  }

  abstract getDisplayValue(): string | number;

  abstract getFormValue(): any;
}
