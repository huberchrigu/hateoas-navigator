import {HalResource} from './hal-resource';

export class EmbeddedResources {
  [linkRelationType: string]: HalResource | HalResource[]
}
