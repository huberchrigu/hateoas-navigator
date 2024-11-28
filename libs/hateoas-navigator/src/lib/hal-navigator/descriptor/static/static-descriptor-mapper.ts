import {PropertyConfig} from '../../config';
import {FormFieldBuilder} from '../../form';
import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {DescriptorBuilder} from '../mapper/descriptor-builder';

class NamedConfig {
  constructor(public name: string | null, public config: PropertyConfig) {
  }
}

export class StaticDescriptorMapper extends DescriptorMapper<NamedConfig> {

  constructor(private name: string | null, protected config: PropertyConfig, protected itemConfigs: { [p: string]: PropertyConfig }) {
    super();
  }

  map(builder: DescriptorBuilder<NamedConfig>) {
    builder.withName(this.name!)
      .withTitle(this.getTitle())
      .withChildren(this.getChildrenDescriptors())
      .withArrayItems(this.getArrayItemsDescriptor())
      .withAssociation(this.getAssociatedResourceName())
      .withLinkFunction(this.config.actionLinks ? uri => this.getDescriptorForLink(uri) : undefined)
      .withFieldProcessor(field => this.addFormFieldDetails(field))
      .withBuilder(named => new StaticDescriptorMapper(named!.name, named!.config, this.itemConfigs))
      .withIsArrayOfAssociations(this.config.isArrayOfAssociations);
  }

  getTitle(): string | undefined {
    return this.config.title;
  }

  getChildrenDescriptors(): Array<NamedConfig> {
    if (!this.config.properties) {
      return [];
    }
    return Object.keys(this.config.properties).map(key => new NamedConfig(key, this.config.properties![key]));
  }

  getArrayItemsDescriptor(): NamedConfig | null {
    return this.config.items ? new NamedConfig(null, this.config.items) : null;
  }

  getAssociatedResourceName(): string | undefined {
    return this.config.associatedResourceName;
  }

  getDescriptorForLink(uri: string): NamedConfig | null {
    const indexOfLastSlash = uri.lastIndexOf('/');
    const actionName = indexOfLastSlash > -1 ? uri.substring(indexOfLastSlash + 1) : uri;
    if (!this.config.actionLinks) {
      return null;
    }
    const c = this.config.actionLinks[actionName];
    return c ? new NamedConfig(actionName, c) : null;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    return formFieldBuilder
      .withDateTimeType(this.config.dateTimeType)
      .withLinkedResource(this.config.associatedResourceName)
      .withOptions(this.config.enumOptions);
  }
}
