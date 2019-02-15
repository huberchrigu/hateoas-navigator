import {
  ArrayPropertyDescriptor,
  AssociationPropertyDescriptor,
  ObjectPropertyDescriptor,
  PropDescriptor
} from './deprecated-property-descriptor';

export class DescriptorFactory {
  asObjects(descs: Array<PropDescriptor>): Array<ObjectPropertyDescriptor> {
    return this.convert(descs, d => d as ObjectPropertyDescriptor, d => !!d.getChildDescriptors);
  }

  asArrays(descs: Array<PropDescriptor>): Array<ArrayPropertyDescriptor<PropDescriptor>> {
    return this.convert(descs, d => d as ArrayPropertyDescriptor<PropDescriptor>, d => !!d.getItemsDescriptor);
  }

  asAssociations(descs: Array<PropDescriptor>): Array<AssociationPropertyDescriptor> {
    return this.convert(descs, d => d as AssociationPropertyDescriptor, d => !!d.getAssociatedResourceName);
  }

  private convert<T>(descs: Array<PropDescriptor>, conversionFunction: (d: PropDescriptor) => T, onlyFor: (d: T) => boolean): Array<T> {
    return descs.map(d => conversionFunction(d)).filter(d => onlyFor(d));
  }
}
