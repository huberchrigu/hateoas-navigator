import {AlpsDescriptorDoc} from 'app/hal-navigator/alp-document/alps-descriptor-doc';

import {AlpsDescriptorType} from '@hal-navigator/alp-document/alps-descriptor-type';

export interface AlpsDescriptor {
  id: string;
  href: string;
  descriptors: AlpsDescriptor[];
  name: string;
  type: AlpsDescriptorType;
  rt: string;
  doc: AlpsDescriptorDoc;
}
