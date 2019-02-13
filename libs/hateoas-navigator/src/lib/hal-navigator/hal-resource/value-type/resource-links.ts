import {LinkObject} from '../../link-object/link-object';

export interface ResourceLinks {
  self: LinkObject;

  [linkRelationType: string]: LinkObject;
}
