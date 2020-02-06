import {PropertyFactory} from '../../json-property/factory/property-factory';
import {HalResourceObject, HalValueType} from '../value-type/hal-value-type';
import {ArrayPropertyImpl} from '../../json-property/array/array-property-impl';
import {ObjectPropertyImpl} from '../../json-property/object/object-property-impl';
import {PrimitivePropertyImpl} from '../../json-property/primitive-property-impl';
import {PrimitiveValueType} from '../../json-property/value-type/json-value-type';
import {ResourceObjectDescriptor} from '../../descriptor/resource-object-descriptor';
import {HalResourceFactory} from './hal-resource-factory';
import {
  ArrayDescriptor,
  AssociationDescriptor,
  ObjectDescriptor, GenericPropertyDescriptor
} from '../../descriptor/generic-property-descriptor';
import {ResourceObjectProperty} from '../resource-object-property';
import {HalProperty} from '../../json-property/hal/hal-property';
import {ArrayProperty} from '../../json-property/array/array-property';
import {EmptyPropertyImpl} from 'hateoas-navigator/hal-navigator/json-property/empty-property-impl';

export class HalPropertyFactory implements PropertyFactory<HalValueType> {
  private forArray = false;
  private forArrayOfAssociations = false;

  constructor(private halResourceFactory: HalResourceFactory, private parentDescriptor: ResourceObjectDescriptor = null) {
  }

  /**
   * An embedded resource is described as an association to another resource type, but does already contain real values. Therefore
   * the association is resolved to the associated resource's descriptor.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: HalValueType):
    ResourceObjectProperty | ArrayProperty<HalResourceObject> {
    const childDesc = this.getResDesc(propertyName);
    if (Array.isArray(associationOrArrayOfAssociations)) {
      return new ArrayPropertyImpl(propertyName, associationOrArrayOfAssociations, childDesc as ArrayDescriptor,
        new HalPropertyFactory(this.halResourceFactory, childDesc as ResourceObjectDescriptor)
          .asFactoryOfArrayItems(true)) as ArrayProperty<HalResourceObject>;
    } else if (associationOrArrayOfAssociations && typeof associationOrArrayOfAssociations === 'object') {
      return this.halResourceFactory.create(propertyName, associationOrArrayOfAssociations,
        childDesc ? (childDesc as AssociationDescriptor).getResource() : null);
    }
    throw new Error(`${propertyName} is not an embedded resource or an array of resources`);
  }

  create(name: string, value: HalValueType): HalProperty {
    const childDesc = this.forArray ? this.getArrayDesc() : this.getResDesc(name);
    const childFactory = new HalPropertyFactory(this.halResourceFactory, childDesc as ResourceObjectDescriptor);
    if (Array.isArray(value)) {
      return new ArrayPropertyImpl(name, value, childDesc as ArrayDescriptor, childFactory.asFactoryOfArrayItems());
    } else if (value && typeof value === 'object') {
      if (value._links) {
        return this.halResourceFactory.create(name, value, childDesc as ResourceObjectDescriptor);
      } else {
        return new ObjectPropertyImpl(name, value, childDesc as ObjectDescriptor, childFactory);
      }
    } else {
      return (value === null || value === undefined) ?
        new EmptyPropertyImpl(name, value as null, childDesc) :
        new PrimitivePropertyImpl(name, value as PrimitiveValueType, childDesc);
    }
  }

  asFactoryOfArrayItems(forArrayOfAssociations = false) {
    this.forArray = true;
    this.forArrayOfAssociations = forArrayOfAssociations;
    return this;
  }

  private getResDesc(name: string) {
    return this.parentDescriptor ? this.parentDescriptor.orNull<ObjectDescriptor, 'getChildDescriptor'>(d =>
      d.getChildDescriptor, name) : null;
  }

  private getArrayDesc(): GenericPropertyDescriptor {
    if (!this.parentDescriptor) {
      return null;
    }
    const arrayDesc = this.parentDescriptor
      .orNull<ArrayDescriptor, 'getItemsDescriptor'>(d => d.getItemsDescriptor);
    if (!arrayDesc) {
      return null;
    }
    if (this.forArrayOfAssociations) {
      return (arrayDesc as AssociationDescriptor).getResource();
    } else {
      return arrayDesc;
    }
  }
}
