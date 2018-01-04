import {PropertyConfig} from '@hal-navigator/config/module-configuration';

export class PropertyConfigBuilder {
  properties: { [propertyName: string]: PropertyConfig } = {};

  withProperty(propertyName: string, config: PropertyConfig): PropertyConfigBuilder {
    this.properties[propertyName] = config;
    return this;
  }

  build(): PropertyConfig {
    return {
      properties: this.properties
    };
  }
}
