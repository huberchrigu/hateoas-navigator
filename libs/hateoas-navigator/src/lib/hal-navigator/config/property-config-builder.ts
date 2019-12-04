import {PropertyConfig, QueryConfig} from './module-configuration';

export class PropertyConfigBuilder {
  properties: { [propertyName: string]: PropertyConfig } = {};
  queries: { [queryName: string]: QueryConfig } = {};
  actionLinks: { [actionName: string]: PropertyConfig } = {};
  private title: string;

  private items: PropertyConfig;

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
   * The property can be an array or an object. In the first case, the array item configuration is considered,
   * in the latter case the registered 'properties'.
   */
  build(): PropertyConfig {
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
