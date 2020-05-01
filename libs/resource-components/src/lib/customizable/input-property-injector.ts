import {ComponentRef, SimpleChange} from '@angular/core';

/**
 * Finds all <code>@Input</code> fields in the provided component and injects matching values..
 */
export class InputPropertyInjector {
  constructor(private component: ComponentRef<any>) {
  }

  fromChanges(changes: SimpleChange) {
    this.getAllInputProperties().forEach(property => this.applyChangeIfAvailable(property, changes.currentValue));
  }

  private getAllInputProperties(): string[] {
    const componentType = this.component.componentType as { [field: string]: any };
    const propDecorators = componentType.propDecorators as { [property: string]: PropDecorator[] };
    const properties = propDecorators ? Object.keys(propDecorators) : [];
    return properties
      .filter(property => propDecorators[property]
        .some(decorator => decorator.type.prototype.ngMetadataName === 'Input')
      );
  }

  private applyChangeIfAvailable(property: string, values: { [property: string]: string }) {
    if (Object.keys(values).some(key => key === property)) {
      this.component.instance[property] = values[property];
    }
  }
}

interface PropDecorator {
  type: any;
}
