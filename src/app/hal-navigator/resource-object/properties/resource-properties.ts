import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

/**
 * Extending the {@link Array} class does not work due to a typescript issue.
 */
export class ResourceProperties implements Iterable<ResourceProperty> {

  static fromObject(obj: Object, excludeProperties: string[]) {
    if (!obj || typeof obj !== 'object') {
      throw new Error(`Object expected, but received ${JSON.stringify(obj)}`);
    }
    const properties = new ResourceProperties();
    Object.keys(obj)
      .filter(propertyName => !excludeProperties.some(p => p === propertyName))
      .forEach(propertyName => properties.add(new ResourceProperty(propertyName, obj[propertyName])));
    return properties;
  }

  constructor(private properties: Array<ResourceProperty> = []) {
  }

  [Symbol.iterator](): Iterator<ResourceProperty> {
    return this.properties[Symbol.iterator]();
  }

  add(property: ResourceProperty) {
    this.properties.push(property);
  }

  getPropertyNames(): string[] {
    return this.properties.map(p => p.getName());
  }

  getChildObjects(parent: ResourceProperty): ResourceProperties[] {
      return parent.getArrayValue().map(o => ResourceProperties.fromObject(o, []));
  }
}
