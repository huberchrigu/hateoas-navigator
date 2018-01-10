import {PropertyConfig} from '@hal-navigator/config/module-configuration';

export class PropertyConfigBuilder {
  properties: { [propertyName: string]: PropertyConfig } = {};
  private items: PropertyConfig;

  withProperty(propertyName: string, config: PropertyConfig): PropertyConfigBuilder {
    this.properties[propertyName] = config;
    return this;
  }

  withArrayItems(itemsConfig: PropertyConfig): PropertyConfigBuilder {
    this.items = itemsConfig;
    return this;
  }

  /**
   * The property can be an array or an object. In the first case, the array item configuration is consided,
   * in the latter case the registered 'properties'.
   */
  build(): PropertyConfig {
    if (this.items) {
      return {
        items: this.items
      };
    } else {
      return {
        properties: this.properties
      };
    }
  }
}
