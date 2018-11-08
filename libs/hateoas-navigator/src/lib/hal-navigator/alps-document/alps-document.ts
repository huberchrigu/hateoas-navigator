import {AlpsDescriptor} from './alps-descriptor';

export interface AlpsDocument {
  alps: Alps;
}

export interface Alps {
  descriptor: AlpsDescriptor[];
}
