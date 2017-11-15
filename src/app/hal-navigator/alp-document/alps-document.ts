import {AlpsDescriptor} from '@hal-navigator/alp-document/alps-descriptor';

export interface AlpsDocument {
  alps: Alps;
}

export interface Alps {
  descriptors: AlpsDescriptor[];
}
