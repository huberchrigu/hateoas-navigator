import {AlpsDescriptor} from '@hal-navigator/alps-document/alps-descriptor';

export interface AlpsDocument {
  alps: Alps;
}

export interface Alps {
  descriptors: AlpsDescriptor[];
}
