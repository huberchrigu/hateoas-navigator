import {Type} from '@angular/core';
import {CustomComponentConfiguration, CustomizableComponentType} from './custom-component-configuration';

/**
 * How to make a component customizable:
 * <ol>
 *   <li>Add the TYPE to the {@link CustomizableComponentType} enum (usually the component name without the "Component" suffix).</li>
 *   <li>{@link CustomComponentService.registerCustomizableComponent Add the component as default}.</li>
 *   <li>Optional for dialogs: Provide ...DialogData and ...DataResult types for the dialog input and output.</li>
 * </ol>
 *
 * To customize it, provide a {@link CustomComponentConfiguration}.
 */
export class CustomComponentService {
  private static defaultComponents: CustomComponentConfiguration[] = [];

  static registerCustomizableComponent(type: CustomizableComponentType, defaultComponent: Type<any>) {
    CustomComponentService.defaultComponents.push(new CustomComponentConfiguration(type, defaultComponent));
  }

  constructor(private customComponents: CustomComponentConfiguration[]) {
  }

  getByType(type: CustomizableComponentType): Type<any> {
    const found = this.findCustomComponent(type);
    return found ? found.getComponent() : this.findDefaultComponent(type);
  }

  getByDefaultComponent(defaultComponent: Type<any>): Type<any> {
    const type = this.findTypeByDefaultComponent(defaultComponent);
    const found = this.findCustomComponent(type);
    return found ? found.getComponent() : defaultComponent;
  }

  private findCustomComponent(type: CustomizableComponentType) {
    return this.customComponents.find(config => config.isType(type));
  }

  private findTypeByDefaultComponent(defaultComponent: Type<any>) {
    const found = CustomComponentService.defaultComponents.find(config => config.getComponent() === defaultComponent);
    if (!found) {
      throw Error(defaultComponent.name + ' does not seem to be customizable');
    }
    return found.getType();
  }

  private findDefaultComponent(type: CustomizableComponentType) {
    const found = CustomComponentService.defaultComponents.find(config => config.isType(type));
    if (!found) {
      throw new Error('There was no default component registered for type ' + type);
    }
    return found.getComponent();
  }
}
