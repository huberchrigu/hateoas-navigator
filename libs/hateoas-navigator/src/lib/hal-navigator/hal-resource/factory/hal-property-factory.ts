import {PropertyFactory} from '../../json-property/factory/property-factory';
import {HalValueType} from '../value-type/hal-value-type';
import {JsonProperty} from '../../json-property/json-property';
import {JsonArrayPropertyImpl} from '../../json-property/json-array-property-impl';
import {JsonObjectPropertyImpl} from '../../json-property/json-object-property-impl';
import {PrimitiveOrEmptyProperty} from '../../json-property/primitive-or-empty-property';
import {PrimitiveValueType} from '../../json-property/value-type/json-value-type';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {HalResourceFactory} from 'hateoas-navigator/hal-navigator/hal-resource/factory/hal-resource-factory';
import {PropDescriptor} from 'hateoas-navigator';
import {ArrayPropertyDescriptor, ObjectPropertyDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/prop-descriptor';

export class HalPropertyFactory implements PropertyFactory<HalValueType> {
  private forArray = false;

  // TODO: Yet there is no distinction whether metadata is still in or not

  constructor(private halResourceFactory: HalResourceFactory, private parentDescriptor: ResourceDescriptor = null) {
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

  asFactoryOfArrayItems() {
    this.forArray = true;
    return this;
  }

  private getResDesc(name: string) {
    return this.parentDescriptor ? this.parentDescriptor.orNull<ObjectPropertyDescriptor, 'getChildDescriptor'>(d =>
      d.getChildDescriptor, name) : null;
  }

  private getArrayDesc() {
    return this.parentDescriptor ? this.parentDescriptor.orNull<ArrayPropertyDescriptor<PropDescriptor>, 'getItemsDescriptor'>(d =>
      d.getItemsDescriptor) as ResourceDescriptor : null;
  }
}
