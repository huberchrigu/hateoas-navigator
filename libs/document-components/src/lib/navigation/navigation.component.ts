import {Component, OnInit} from '@angular/core';
import {HalDocumentService} from 'hateoas-navigator';
import {NavigationItem} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';

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
      .pipe(flatMap(navigation => navigation.getItems()))
      .subscribe(items => this.items = items);
  }
}