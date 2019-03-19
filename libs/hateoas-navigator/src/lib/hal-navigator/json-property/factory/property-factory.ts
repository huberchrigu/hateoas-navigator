import {JsonProperty} from "libs/hateoas-navigator/src/lib/hal-navigator/json-property/json-property";

export interface PropertyFactory<V> {
  create(name: string, value: V): JsonProperty<V>;
}
