import {PropertyConfig, QueryConfig} from './module-configuration';

/**
 * The property can be an array or an object. In the first case, the array item configuration is considered,
 * in the latter case the registered 'properties'.
 */
export class PropertyConfigBuilder {
  properties: { [propertyName: string]: PropertyConfig } = {};
  queries: { [queryName: string]: QueryConfig } = {};
  actionLinks: { [actionName: string]: PropertyConfig } = {};

  private title!: string;
  private custom: PropertyConfig = {};
  private items!: PropertyConfig;

  withProperty(propertyName: string, config: PropertyConfig): PropertyConfigBuilder {
    this.properties[propertyName] = config;
    return this;
  }

  withQuery(queryName: string, propertyConfig: PropertyConfig) {
    this.queries[queryName] = propertyConfig;
    return this;
  }

  withActionLink(actionName: string, config: PropertyConfig): PropertyConfigBuilder {
    this.actionLinks[actionName] = config;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withArrayItems(itemsConfig: PropertyConfig): PropertyConfigBuilder {
    this.items = itemsConfig;
    return this;
  }

  /**
   * Set a custom attribute.
   */
  with<KEY extends keyof PropertyConfig>(key: KEY, value: PropertyConfig[KEY]): this {
    this.custom[key] = value;
    return this;
  }

  build(): PropertyConfig {
    return {...this.custom, ...this.buildDefinedProperties()};
  }

  private buildDefinedProperties(): PropertyConfig {
    if (this.items) {
      return {
        items: this.items
      };
    } else {
      return {
        title: this.title,
        properties: this.properties,
        actionLinks: this.actionLinks,
        queries: this.queries
      };
    }
  }
}
