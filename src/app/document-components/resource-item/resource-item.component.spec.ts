import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceItemComponent} from './resource-item.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {Observable} from 'rxjs/Observable';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import SpyObj = jasmine.SpyObj;

describe('ResourceItemComponent', () => {
  let component: ResourceItemComponent;
  let fixture: ComponentFixture<ResourceItemComponent>;
  let versionedResourceObject: SpyObj<VersionedResourceObject>;

  beforeEach(async(() => {
    versionedResourceObject = jasmine.createSpyObj<VersionedResourceObject>('resourceObject', ['getAllData', 'getDescriptor']);
    versionedResourceObject.getAllData.and.returnValue([
      {} as ResourceProperty
    ]);
    versionedResourceObject.getDescriptor.and.returnValue({getTitle: () => 'Test'});

    TestBed.configureTestingModule({
      declarations: [ResourceItemComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
          data: Observable.of(
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
    expect(versionedResourceObject.getAllData).toHaveBeenCalled();
  });
});
