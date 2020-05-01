import {Type} from '@angular/core';

/**
 * Use this configuration to provide a custom component of type {@link CustomizableComponentType}. A customizable component of type
 * X often offers an interface XComponentInput with all <code>@Input</code> properties. A dialog type X_DIALOG may provide types
 * XDialogData for the given input data and XDialogResult for the expected return type.
 */
export class CustomComponentConfiguration {

  constructor(private type: CustomizableComponentType, private component: Type<any>) {
  }

  getComponent() {
    return this.component;
  }

  isType(type: CustomizableComponentType) {
    return this.type === type;
  }

  getType() {
    return this.type;
  }
}

export enum CustomizableComponentType {
  ITEM_PROPERTIES, FORM_FIELD, // View Components
  INPUT_FIELD, CHECKBOX_FIELD, SELECT_FIELD, DATE_TIME_FIELD, ASSOCIATION_FIELD, FORM_LIST, FORM_GROUP, // View Components
  LOGIN_DIALOG, RESOURCE_SEARCH_DIALOG, SEND_DATA_DIALOG, MESSAGE_DIALOG // Dialog Components
}
