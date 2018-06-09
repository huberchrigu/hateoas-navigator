import {Component, Input} from '@angular/core';
import {ResourceProperty} from 'hateoas-navigator';

@Component({
  selector: 'app-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent {

  @Input()
  properties: ResourceProperty[];

}
