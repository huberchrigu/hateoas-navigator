import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Data, Params, provideRoutes, Router} from '@angular/router';
import {of} from 'rxjs';
import SpyObj = jasmine.SpyObj;
import {ResourceListComponent} from './resource-list.component';
import {MatDialog} from '@angular/material/dialog';
import {ResourceObjectDescriptor, ResourceService} from 'hateoas-navigator';
import {ResourceActions} from 'hateoas-navigator';
import {CollectionAdapter} from 'hateoas-navigator';
import {CustomComponentService} from '../customizable/custom-component.service';

describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;
  let collectionAdapter: SpyObj<CollectionAdapter>;

  const actions = {
    isCreateEnabled: () => true
  } as ResourceActions;

  beforeEach(async () => {
    collectionAdapter = jasmine.createSpyObj('collectionAdapter', ['getItems', 'getName', 'getPropertyNames', 'getDescriptor']);
    collectionAdapter.getDescriptor.and.returnValue({
      getTitle: () => 'Resources',
      getActions: () => actions
    } as ResourceObjectDescriptor);
    await TestBed.configureTestingModule({
      imports: [ResourceListComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            data: of({
              collectionAdapter,
              schemaAdapter: jasmine.createSpyObj('schemaAdapter', ['getTitle'])
            } as Data),
            queryParams: of({} as Params)
          } as ActivatedRoute
        },
        provideRoutes([]),
        {provide: MatDialog, useValue: {}},
        {provide: ResourceService, useValue: {}},
        {provide: CustomComponentService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch the resource data', () => {
    expect(collectionAdapter.getItems).toHaveBeenCalled();
  });
});
