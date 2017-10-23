import {ResourceObject} from '@hal-navigator/resource-object/resource-object';

export class EmbeddedResources {
  [linkRelationType: string]: ResourceObject | ResourceObject[]
}
