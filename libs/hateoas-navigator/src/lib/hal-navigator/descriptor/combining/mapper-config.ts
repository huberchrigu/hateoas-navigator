import {AlpsDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/alps/alps-descriptor-mapper';

export interface MapperConfig {
  ignoreChildren: boolean;
}

export interface MapperConfigs {
  [mapperName: string]: MapperConfig;
}

export class DefaultMapperConfigs {
  static ignoreChildrenFromAlps(): MapperConfigs {
    const mapperConfigs = {} as MapperConfigs;
    mapperConfigs[AlpsDescriptorMapper.name] = {ignoreChildren: true};
    return mapperConfigs;
  }
}
