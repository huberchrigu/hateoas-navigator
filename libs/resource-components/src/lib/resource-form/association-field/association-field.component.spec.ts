import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AssociationFieldComponent} from './association-field.component';
import {Observable} from 'rxjs';
import {By} from '@angular/platform-browser';
import {ResourceService, ResourceObjectProperty, CollectionAdapter, LinkField, ResourceLink} from 'hateoas-navigator';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AssociationFieldComponent', () => {
  let component: AssociationFieldComponent;
  let fixture: ComponentFixture<AssociationFieldComponent>;
  let resourceService: ResourceService;

  const href = '/resources/1';
  const title = 'Item 1';

  beforeEach(async () => {
    const link = jasmine.createSpyObj<ResourceLink>({getHref: href})
    const item = jasmine.createSpyObj<ResourceObjectProperty>({
      getSelfLink: link,
      getDisplayValue: title
    });
    const collection = jasmine.createSpyObj<CollectionAdapter>({
      getItems: [item]
    });
    resourceService = jasmine.createSpyObj<ResourceService>({
      getCollection: new Observable<CollectionAdapter>(subscriber => subscriber.next(collection))
    });
    await TestBed.configureTestingModule({
      imports: [AssociationFieldComponent, BrowserAnimationsModule],
      providers: [{
        useValue: resourceService,
        provide: ResourceService
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AssociationFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    component.field = new LinkField('link', true, false, 'Link', 'resources');
    fixture.detectChanges();
  });

  it('should show option', () => {
    const option = fixture.debugElement.query(By.css('mat-option'));
    expect(option).not.toBeNull();
    expect(option.attributes['value']).toBe(href);
    expect(option.nativeElement.textContent).toBe(title);
  });
});
