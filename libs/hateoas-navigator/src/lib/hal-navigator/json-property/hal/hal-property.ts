import {GenericProperty} from '../generic-property';
import {HalValueType} from '../../hal-resource/value-type';
import {GenericPropertyDescriptor} from '../../descriptor/generic-property-descriptor';

/**
 * A simplification of a {@link GenericProperty} with {@link HalValueType},
 * which assumes that all value types can be described by {@link GenericPropertyDescriptor}.
 */
export interface HalProperty extends GenericProperty<HalValueType, GenericPropertyDescriptor> {
}
