import {Component, OnInit} from '@angular/core';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {NavigationItem} from '@hal-navigator/navigation/navigation-item';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  items: Array<NavigationItem>;

  constructor(private halDocumentService: HalDocumentService) {

  }

  ngOnInit(): void {
    this.halDocumentService.getRootNavigation()
      .flatMap(navigation => navigation.getItems())
      .subscribe(items => this.items = items);
  }
}
