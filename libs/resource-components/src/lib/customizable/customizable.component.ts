import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input, OnChanges, OnDestroy,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {CustomizableDirective} from './customizable.directive';
import {InputPropertyInjector} from './input-property-injector';
import {CustomComponentService} from './custom-component.service';
import {CustomizableComponentType} from './custom-component-configuration';

/**
 * How to make a view component X customizable:
 * <ol>
 *   <li>{@link CustomComponentService Make the component type X customizable}.</li>
 *   <li>Remove all component usages with <code>&lt;lib-customizable/></code> and the previously registered {@link type}.</li>
 *   <li>Optional: Provide an interface for all the {@link Input @Input} properties. Call it <code>XComponentInput</code>.
 *   Use this interface to pass the {@link input}.</li>
 * </ol>
 */
@Component({
  selector: 'lib-customizable',
  imports: [
    CustomizableDirective
  ],
  template: '<ng-template libCustomizable></ng-template>'
})
export class CustomizableComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  type!: CustomizableComponentType;

  @Input()
  input: { [property: string]: any } = {};

  private injector!: InputPropertyInjector;
  private initialValues!: SimpleChanges;

  @ViewChild(CustomizableDirective, {static: true})
  customizable!: CustomizableDirective;

  private component!: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private customComponentService: CustomComponentService) {
  }

  ngOnInit(): void {
    const componentType = this.customComponentService.getByType(this.type);
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.component = this.customizable.viewContainerRef.createComponent(factory);
    this.injector = new InputPropertyInjector(this.component);
    if (this.initialValues) {
      this.ngOnChanges(this.initialValues);
    }
  }

  ngOnDestroy(): void {
    this.component.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.injector) {
      const input = changes['input'];
      this.injector.fromChanges(input);
    } else {
      this.initialValues = changes;
    }
  }
}
