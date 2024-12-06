import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceItemComponent} from './resource-item.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, provideRoutes} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ResourceService} from 'hateoas-navigator';
import {VersionedResourceObjectProperty} from 'hateoas-navigator';
import SpyObj = jasmine.SpyObj;
import {ResourceActions} from 'hateoas-navigator';
import {ResourceObjectDescriptor} from 'hateoas-navigator';
import {of} from 'rxjs';
import {PrimitivePropertyImpl} from 'hateoas-navigator';
import {ResourceObjectPropertyFactoryService} from 'hateoas-navigator';
import {DUMMY_CUSTOM_COMPONENT_SERVICE_PROVIDER} from '../customizable/dummy.component';

describe('ResourceItemComponent', () => {
  let component: ResourceItemComponent;
  let fixture: ComponentFixture<ResourceItemComponent>;
  let versionedResourceObject: SpyObj<VersionedResourceObjectProperty>;

  const actions = {
    isDeleteEnabled: () => true,
    isUpdateEnabled: () => true
  } as ResourceActions;

  beforeEach(async () => {
    versionedResourceObject = jasmine.createSpyObj<VersionedResourceObjectProperty>('resourceObject',
      ['getChildProperties', 'getDescriptor', 'getOtherLinks']);
    versionedResourceObject.getChildProperties.and.returnValue([
      {} as PrimitivePropertyImpl
    ]);
    versionedResourceObject.getDescriptor.and.returnValue({
      getTitle: () => 'Test',
      getActions: () => actions
    } as ResourceObjectDescriptor);
    versionedResourceObject.getOtherLinks.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [ResourceItemComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            data: of(
              {
                resourceObject: versionedResourceObject
              })
          }
        },
        {provide: MatDialog, useValue: {}},
        provideRoutes([]),
        {provide: ResourceService, useValue: {}},
        {provide: ResourceObjectPropertyFactoryService, useValue: {}},
        DUMMY_CUSTOM_COMPONENT_SERVICE_PROVIDER
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch the resource data', () => {
    expect(versionedResourceObject.getChildProperties).toHaveBeenCalled();
  });
});
