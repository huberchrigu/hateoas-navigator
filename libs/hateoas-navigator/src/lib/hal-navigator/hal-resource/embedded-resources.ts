import {HalResourceObject} from './hal-resource-object';

export class EmbeddedResources {
  [linkRelationType: string]: HalResourceObject | HalResourceObject[]
}
