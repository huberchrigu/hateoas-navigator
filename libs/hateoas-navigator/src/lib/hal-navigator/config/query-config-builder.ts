import {FormFieldSupport, QueryConfig} from './module-configuration';

export class QueryConfigBuilder {
  private params: { [paramName: string]: FormFieldSupport } = {};
  private title!: string;

  withParam(paramName: string, config: FormFieldSupport): this {
    this.params[paramName] = config;
    return this;
  }

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  build(): QueryConfig {
    return {
      title: this.title,
      params: this.params
    };
  }
}
