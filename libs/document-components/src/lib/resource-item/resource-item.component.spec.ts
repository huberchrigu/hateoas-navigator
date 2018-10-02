import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceItemComponent} from './resource-item.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HalDocumentService} from 'hateoas-navigator';
import {VersionedResourceAdapter} from 'hateoas-navigator';
import {ResourceProperty} from 'hateoas-navigator';
import SpyObj = jasmine.SpyObj;
import {ResourceActions} from 'hateoas-navigator';
import {ResourceDescriptor} from 'hateoas-navigator';
import {of} from 'rxjs/index';

describe('ResourceItemComponent', () => {
  let component: ResourceItemComponent;
  let fixture: ComponentFixture<ResourceItemComponent>;
  let versionedResourceObject: SpyObj<VersionedResourceAdapter>;

  const actions = {
    isDeleteEnabled: () => true,
    isUpdateEnabled: () => true
  } as ResourceActions;

  beforeEach(async(() => {
    versionedResourceObject = jasmine.createSpyObj<VersionedResourceAdapter>('resourceObject',
      ['getPropertiesAndEmbeddedResourcesAsProperties', 'getDescriptor']);
    versionedResourceObject.getPropertiesAndEmbeddedResourcesAsProperties.and.returnValue([
      {} as ResourceProperty
    ]);
    versionedResourceObject.getDescriptor.and.returnValue({
      getTitle: () => 'Test',
      getActions: () => actions
    } as ResourceDescriptor);

    TestBed.configureTestingModule({
      declarations: [ResourceItemComponent],
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
        {provide: Router, useValue: {}},
        {provide: HalDocumentService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch the resource data', () => {
    expect(versionedResourceObject.getPropertiesAndEmbeddedResourcesAsProperties).toHaveBeenCalled();
  });
});