import {HalResource} from 'app/hal-navigator/hal-resource/hal-resource';

export class EmbeddedResources {
  [linkRelationType: string]: HalResource | HalResource[]
}
