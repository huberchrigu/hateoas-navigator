import {CustomComponentService} from "./custom-component.service";
import {Component} from '@angular/core';

/**
 * A dummy component that does not have any dependencies. This can be used as component returned by the CustomComponentService.
 */
@Component({
  template: ''
})
class DummyComponent {

}

export const DUMMY_CUSTOM_COMPONENT_SERVICE_PROVIDER = {
  provide: CustomComponentService, useValue: jasmine.createSpyObj<CustomComponentService>({
    getByType: DummyComponent
  })
}
