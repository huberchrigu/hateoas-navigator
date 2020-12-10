import {PropertyDescriptorImpl} from './property-descriptor-impl';
import {ArrayDescriptor, GenericPropertyDescriptor} from '../../generic-property-descriptor';
import {FormFieldBuilder} from '../../../form';
import {FieldProcessor} from './field-processor';

export class ArrayDescriptorImpl extends PropertyDescriptorImpl implements ArrayDescriptor {
    constructor(name: string, title: string, private arrayItems: GenericPropertyDescriptor, fieldProcessor: FieldProcessor) {
        super(name, title, fieldProcessor);
        if (!this.arrayItems) {
            throw new Error('An array requires array items');
        }
    }

    getItemsDescriptor<D extends GenericPropertyDescriptor>(): D {
        return this.arrayItems as D;
    }

    toFormFieldBuilder(): FormFieldBuilder {
        return super.toFormFieldBuilder()
            .withArraySpecProvider(() => this.arrayItems.toFormFieldBuilder());
    }
}
