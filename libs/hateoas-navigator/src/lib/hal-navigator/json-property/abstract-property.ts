import {JsonProperty} from './json-property';
import {PropDescriptor} from '../descriptor';
import {NotNull} from 'hateoas-navigator/decorators/not-null';

export abstract class AbstractProperty<V, D extends PropDescriptor> implements JsonProperty<V> {

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

  /**
   * Use this internally if null/undefined values are ok.
   */
  protected getDescriptorIfAny(): D {
    return this.descriptor;
  }

  abstract getDisplayValue(): string | number;

  abstract getFormValue(): any;
}
