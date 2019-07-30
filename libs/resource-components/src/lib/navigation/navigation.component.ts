import {Component, OnInit} from '@angular/core';
import {ResourceService} from 'hateoas-navigator';
import {NavigationItem} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'lib-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  items: Array<NavigationItem>;

  constructor(private halDocumentService: ResourceService) {

  }

  ngOnInit(): void {
    this.halDocumentService.getRootNavigation()
      .pipe(flatMap(navigation => navigation.getItems()))
      .subscribe(items => this.items = items);
  }
}
