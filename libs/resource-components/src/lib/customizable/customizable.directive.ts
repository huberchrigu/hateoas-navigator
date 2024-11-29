import {Directive, ViewContainerRef} from '@angular/core';

/**
 * Used to reference the container to add customizable components to it.
 */
@Directive({
  selector: '[libCustomizable]',
  standalone: true
})
export class CustomizableDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
