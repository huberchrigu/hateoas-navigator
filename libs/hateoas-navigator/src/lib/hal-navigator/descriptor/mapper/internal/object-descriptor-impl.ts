import {PropertyDescriptorImpl} from './property-descriptor-impl';
import {GenericPropertyDescriptor, ObjectDescriptor} from '../../generic-property-descriptor';
import {FieldProcessor} from './field-processor';

export class ObjectDescriptorImpl extends PropertyDescriptorImpl implements ObjectDescriptor {
    constructor(name: string, title: string, private children: GenericPropertyDescriptor[], fieldProcessor: FieldProcessor) {
        super(name, title, fieldProcessor);
        if (!children) {
            throw new Error('An object requires child properties');
        }
    }

    getChildDescriptor<T extends GenericPropertyDescriptor>(resourceName: string): T {
        return this.children.find(d => d.getName() === resourceName) as T;
    }

    getChildDescriptors<T extends GenericPropertyDescriptor>(): Array<T> {
        return this.children as T[];
    }

    toFormFieldBuilder() {
        return super.toFormFieldBuilder()
            .withSubFields(this.getChildDescriptors().map(d => d.toFormFieldBuilder()));
    }
}
