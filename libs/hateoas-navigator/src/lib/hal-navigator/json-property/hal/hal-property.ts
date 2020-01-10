import {GenericProperty} from '../generic-property';
import {HalValueType} from '../../hal-resource/value-type';
import {PropDescriptor} from '../../descriptor/prop-descriptor';

/**
 * A simplification of a {@link GenericProperty} with {@link HalValueType},
 * which assumes that all value types can be described by {@link PropDescriptor}.
 */
export interface HalProperty extends GenericProperty<HalValueType, PropDescriptor> {
}
