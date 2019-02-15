import {DescriptorBuilder} from './descriptor-builder';
import {PropDescriptor} from '../deprecated-property-descriptor';

export abstract class DescriptorMapper<T> {
  toDescriptor(): PropDescriptor {
    const builder = new DescriptorBuilder<T>();
    this.map(builder);
    return builder.toDescriptor();
  }

  abstract map(builder: DescriptorBuilder<T>);
}
