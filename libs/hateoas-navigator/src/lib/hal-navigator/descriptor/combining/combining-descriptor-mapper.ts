import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {DescriptorBuilder, FieldProcessor} from '../mapper/descriptor-builder';
import {PropertyCombiner} from '../mapper/property-combiner';
import {ResourceActions} from 'hateoas-navigator';
import {TwoArrays} from 'hateoas-navigator/js/two-any';
import {MapperConfigs} from './mapper-config';
import {LOGGER} from 'hateoas-navigator/logging/logger';

/**
 * Accepts a list of descriptors. Each request is forwarded to any item of this list.
 * The first defined result is returned.
 */
export class CombiningDescriptorMapper extends DescriptorMapper<DescriptorMapper<any>[]> {

  /**
   * @param mappers At least one mapper
   * @param mapperConfigs Not null/undefined
   */
  constructor(private mappers: Array<DescriptorMapper<any>>, private mapperConfigs: MapperConfigs) {
    super();
    if (mappers.length === 0) {
      throw new Error('Invalid descriptor: No descriptors to combine');
    }
  }

  /**
   * If this query parameter matches the resource name, its child builders and final result are logged.
   */
  private static readonly DEBUG_DESCRIPTOR_PARAM = 'debugDescriptor';

  private static getLinkedResource<T>(uri: string, builder: DescriptorBuilder<T>, linkFunction: (uri: string) => T) {
    const value: T = linkFunction(uri);
    return value ? builder.builderFunction(value) : null;
  }

  private static logResult(name: string) {
    return new URLSearchParams(window.location.search).get(CombiningDescriptorMapper.DEBUG_DESCRIPTOR_PARAM) === name;
  }

  /**
   * Skip properties that can be ignored due to the type.
   */
  map(builder: DescriptorBuilder<Array<DescriptorMapper<any>>>) {
    const builders = this.mappers.map(mapper => mapper.toBuilder());
    const combiner = new PropertyCombiner<DescriptorBuilder<any>>(builders);
    const type = combiner.getFirst('type');
    const name = combiner.getFirst('name');
    builder.withName(name)
      .withType(type)
      .withBuilder(mappers => {
        this.verifyNoLoop(mappers);
        return new CombiningDescriptorMapper(mappers, this.mapperConfigs);
      })
      .withTitle(combiner.getFirst('title'));
    if (!type || type === 'resource' || type === 'object') {
      builder.withActions(combiner.reduce('actions', (previous, current) => previous.include(current), new ResourceActions([])))
        .withLinkFunction(builders.some(b => !!b.linkFunction) ? this.getLinkFunction(combiner) : undefined)
        .withChildren(combiner.groupValuesBy(b => this.mapChildren(b),
          (mapper: DescriptorMapper<any>) => mapper.toBuilder().name, b => this.ignoreChildren(b)));
    }
    if (!type || type === 'array') {
      builder.withArrayItems(combiner.map('arrayItems', (b, value) => b.builderFunction(value)));
    }
    if (!type || type === 'association') {
      builder.withAssociation(combiner.getFirst('association'));
    }
    builder.withFieldProcessor(combiner.reduce('fieldProcessor',
      (a: FieldProcessor, b: FieldProcessor) => (fieldBuilder) => a(b(fieldBuilder)), builder.fieldProcessor));

    if (CombiningDescriptorMapper.logResult(name)) {
      builder.setLogResult();
      builders.forEach(childBuilder => LOGGER.debug(childBuilder.mapperName + ': ' + JSON.stringify(childBuilder)));
    }
  }

  getMapperName(): string {
    return super.getMapperName() + ` (${this.mappers.map(mapper => mapper.getMapperName()).reduce((a, b) => a + ', ' + b)})`;
  }

  private ignoreChildren(builder: DescriptorBuilder<any>) {
    const config = this.mapperConfigs[builder.mapperName];
    return config ? config.ignoreChildren : false;
  }

  private getLinkFunction(combiner) {
    return (uri: string) => combiner.map('linkFunction',
      (builder, linkFunction) => CombiningDescriptorMapper.getLinkedResource(uri, builder, linkFunction));
  }

  private mapChildren(builder: DescriptorBuilder<DescriptorMapper<any>>) {
    if (builder.children) {
      return builder.children.map(child => builder.builderFunction(child));
    } else {
      return undefined;
    }
  }

  /**
   * Avoid infinite loops by preventing new mappers to be the same as its parent (this).
   */
  private verifyNoLoop(mappers: Array<DescriptorMapper<any>>) {
    if (new TwoArrays(mappers, this.mappers).areEqual()) {
      throw new Error(`New combining descriptor mapper should not have the same input as the parent ${this.getMapperName()}`);
    }
  }
}

