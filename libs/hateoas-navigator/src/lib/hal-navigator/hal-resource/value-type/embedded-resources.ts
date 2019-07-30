import {HalResourceObject} from './hal-value-type';

export interface EmbeddedResources {
  [linkRelationType: string]: HalResourceObject | HalResourceObject[];
}
