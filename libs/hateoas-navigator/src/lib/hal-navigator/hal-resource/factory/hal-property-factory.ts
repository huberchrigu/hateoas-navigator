import {PropertyFactory} from '../../json-property/factory/property-factory';
import {HalResourceObject, HalValueType} from '../value-type/hal-value-type';
import {JsonArrayProperty, JsonProperty} from '../../json-property/json-property';
import {JsonArrayPropertyImpl} from '../../json-property/json-array-property-impl';
import {JsonObjectPropertyImpl} from '../../json-property/json-object-property-impl';
import {PrimitiveOrEmptyProperty} from '../../json-property/primitive-or-empty-property';
import {PrimitiveValueType} from '../../json-property/value-type/json-value-type';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {HalResourceFactory} from './hal-resource-factory';
import {
  ArrayPropertyDescriptor,
  AssociationPropertyDescriptor,
  ObjectPropertyDescriptor, PropDescriptor
} from '../../descriptor/prop-descriptor';
import {JsonResourceObject} from '../json-resource-object';

export class HalPropertyFactory implements PropertyFactory<HalValueType> {
  private forArray = false;
  private forArrayOfAssociations = false;

  constructor(private halResourceFactory: HalResourceFactory, private parentDescriptor: ResourceDescriptor = null) {
  }

  /**
   * An embedded resource is described as an association to another resource type, but does already contain real values. Therefore
   * the association is resolved to the associated resource's descriptor.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: HalValueType):
    JsonResourceObject | JsonArrayProperty<HalResourceObject> {
    const childDesc = this.getResDesc(propertyName);
    if (Array.isArray(associationOrArrayOfAssociations)) {
      return new JsonArrayPropertyImpl(propertyName, associationOrArrayOfAssociations, childDesc,
        new HalPropertyFactory(this.halResourceFactory, childDesc as ResourceDescriptor)
          .asFactoryOfArrayItems(true)) as JsonArrayProperty<HalResourceObject>;
    } else if (associationOrArrayOfAssociations && typeof associationOrArrayOfAssociations === 'object') {
      return this.halResourceFactory.create(propertyName, associationOrArrayOfAssociations,
        childDesc ? (childDesc as AssociationPropertyDescriptor).getResource() : null);
    }
    throw new Error(`${propertyName} is not an embedded resource or an array of resources`);
  }

  create(name: string, value: HalValueType): JsonProperty<HalValueType> {
    const childDesc = (this.forArray ? this.getArrayDesc() : this.getResDesc(name)) as ResourceDescriptor;
    const childFactory = new HalPropertyFactory(this.halResourceFactory, childDesc);
    if (Array.isArray(value)) {
      return new JsonArrayPropertyImpl(name, value, childDesc, childFactory.asFactoryOfArrayItems());
    } else if (value && typeof value === 'object') {
      if (value._links) { // TODO: There might be _links without a self link
        return this.halResourceFactory.create(name, value, childDesc);
      } else {
        return new JsonObjectPropertyImpl(name, value, childDesc, childFactory);
      }
    } else {
      return new PrimitiveOrEmptyProperty(name, value as PrimitiveValueType, childDesc);
    }
  }

  asFactoryOfArrayItems(forArrayOfAssociations = false) {
    this.forArray = true;
    this.forArrayOfAssociations = forArrayOfAssociations;
    return this;
  }

  private getResDesc(name: string) {
    return this.parentDescriptor ? this.parentDescriptor.orNull<ObjectPropertyDescriptor, 'getChildDescriptor'>(d =>
      d.getChildDescriptor, name) : null;
  }

  private getArrayDesc() {
    if (!this.parentDescriptor) {
      return null;
    }
    const arrayDesc = this.parentDescriptor
      .orNull<ArrayPropertyDescriptor<PropDescriptor>, 'getItemsDescriptor'>(d => d.getItemsDescriptor);
    if (!arrayDesc) {
      return null;
    }
    if (this.forArrayOfAssociations) {
      return (arrayDesc as AssociationPropertyDescriptor).getResource();
    } else {
      return arrayDesc;
    }
  }
}
