import {PropertyFactory} from '../../json-property/factory/property-factory';
import {HalResourceObject, HalValueType} from '../value-type/hal-value-type';
import {ArrayPropertyImpl} from '../../json-property/array/array-property-impl';
import {ObjectPropertyImpl} from '../../json-property/object/object-property-impl';
import {PrimitiveOrEmptyProperty} from '../../json-property/primitive-or-empty-property';
import {PrimitiveValueType} from '../../json-property/value-type/json-value-type';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {HalResourceFactory} from './hal-resource-factory';
import {
  ArrayPropertyDescriptor,
  AssociationPropertyDescriptor,
  ObjectPropertyDescriptor, PropDescriptor
} from '../../descriptor/prop-descriptor';
import {ResourceObjectProperty} from '../resource-object-property';
import {HalProperty} from '../../json-property/hal/hal-property';
import {ArrayProperty} from '../../json-property/array/array-property';

export class HalPropertyFactory implements PropertyFactory<HalValueType> {
  private forArray = false;
  private forArrayOfAssociations = false;

  constructor(private halResourceFactory: HalResourceFactory, private parentDescriptor: ResourceDescriptor = null) { // TODO: Decouple descriptor handling
  }

  /**
   * An embedded resource is described as an association to another resource type, but does already contain real values. Therefore
   * the association is resolved to the associated resource's descriptor.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: HalValueType):
    ResourceObjectProperty | ArrayProperty<HalResourceObject> {
    const childDesc = this.getResDesc(propertyName);
    if (Array.isArray(associationOrArrayOfAssociations)) {
      return new ArrayPropertyImpl(propertyName, associationOrArrayOfAssociations, childDesc as ArrayPropertyDescriptor,
        new HalPropertyFactory(this.halResourceFactory, childDesc as ResourceDescriptor)
          .asFactoryOfArrayItems(true)) as ArrayProperty<HalResourceObject>;
    } else if (associationOrArrayOfAssociations && typeof associationOrArrayOfAssociations === 'object') {
      return this.halResourceFactory.create(propertyName, associationOrArrayOfAssociations,
        childDesc ? (childDesc as AssociationPropertyDescriptor).getResource() : null);
    }
    throw new Error(`${propertyName} is not an embedded resource or an array of resources`);
  }

  create(name: string, value: HalValueType): HalProperty {
    const childDesc = this.forArray ? this.getArrayDesc() : this.getResDesc(name);
    const childFactory = new HalPropertyFactory(this.halResourceFactory, childDesc as ResourceDescriptor);
    if (Array.isArray(value)) {
      return new ArrayPropertyImpl(name, value, childDesc as ArrayPropertyDescriptor, childFactory.asFactoryOfArrayItems());
    } else if (value && typeof value === 'object') {
      if (value._links) { // TODO: There might be _links without a self link
        return this.halResourceFactory.create(name, value, childDesc as ResourceDescriptor);
      } else {
        return new ObjectPropertyImpl(name, value, childDesc as ObjectPropertyDescriptor, childFactory);
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

  private getArrayDesc(): PropDescriptor {
    if (!this.parentDescriptor) {
      return null;
    }
    const arrayDesc = this.parentDescriptor
      .orNull<ArrayPropertyDescriptor, 'getItemsDescriptor'>(d => d.getItemsDescriptor);
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
