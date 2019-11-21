import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import {of} from 'rxjs';
import SpyObj = jasmine.SpyObj;
import {ResourceListComponent} from '../resource-list/resource-list.component';
import {MatDialog} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {ResourceDescriptor, ResourceService} from 'hateoas-navigator';
import {ResourceActions} from 'hateoas-navigator';
import {CollectionAdapter} from 'hateoas-navigator';

describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;
  let collectionAdapter: SpyObj<CollectionAdapter>;

  const actions = {
    isCreateEnabled: () => true
  } as ResourceActions;

  beforeEach(async(() => {
    collectionAdapter = jasmine.createSpyObj('collectionAdapter', ['getItems', 'getName', 'getPropertyNames', 'getDescriptor']);
    collectionAdapter.getDescriptor.and.returnValue({
      getTitle: () => 'Resources',
      getActions: () => actions
    } as ResourceDescriptor);
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [ResourceListComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            data: of({
              collectionAdapter: collectionAdapter,
              schemaAdapter: jasmine.createSpyObj('schemaAdapter', ['getTitle'])
            } as Data),
            queryParams: of({} as Params)
          } as ActivatedRoute
        },
        {provide: Router, useValue: {}},
        {provide: MatDialog, useValue: {}},
        {provide: ResourceService, useValue: {}}
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
