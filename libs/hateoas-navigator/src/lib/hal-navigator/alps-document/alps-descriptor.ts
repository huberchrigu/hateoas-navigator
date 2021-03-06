import {AlpsDescriptorType} from './alps-descriptor-type';
import {AlpsDescriptorDoc} from './alps-descriptor-doc';

export interface AlpsDescriptor {
  id: string;
  href: string;
  descriptor: AlpsDescriptor[];
  name: string;
  type: AlpsDescriptorType;
  rt: string;
  doc: AlpsDescriptorDoc;
}
