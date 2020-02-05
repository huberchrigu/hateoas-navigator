import {DescriptorBuilder} from './descriptor-builder';
import {GenericPropertyDescriptor} from '../generic-property-descriptor';

export abstract class DescriptorMapper<T> {
  toDescriptor(): GenericPropertyDescriptor {
    return this.toBuilder().toDescriptor();
  }

  abstract map(builder: DescriptorBuilder<T>);

  toBuilder() {
    const builder = new DescriptorBuilder<T>(this.getMapperName());
    this.map(builder);
    return builder;
  }

  getMapperName() {
    return this.constructor.name;
  }
}
