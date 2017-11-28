import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import SpyObj = jasmine.SpyObj;
import {ResourceListComponent} from '@document-components/resource-list/resource-list.component';
import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {MatHeaderRow, MatRow, MatTableModule} from '@angular/material';

describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;
  let collectionAdapter: SpyObj<CollectionAdapter>;

  beforeEach(async(() => {
    collectionAdapter = jasmine.createSpyObj('collectionAdapter', ['getItems', 'getResourceName', 'getPropertyNames']);
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [ResourceListComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
          data: Observable.of(
            {
              collectionAdapter: collectionAdapter,
              schemaAdapter: jasmine.createSpyObj('schemaAdapter', ['getTitle'])
            })
        }
        },
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch the resource data', () => {
    expect(collectionAdapter.getItems).toHaveBeenCalled();
  });
});
