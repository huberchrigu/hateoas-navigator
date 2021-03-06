import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ResourceFormComponent} from './resource-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {GenericPropertyDescriptor, ResourceService} from 'hateoas-navigator';
import {ActivatedRoute, Data, Router} from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import {SubFormField} from 'hateoas-navigator';
import {FormFieldBuilder} from 'hateoas-navigator';
import {FormField} from 'hateoas-navigator';
import {of} from 'rxjs';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  beforeEach(waitForAsync(() => {
      const resourceDescriptor = jasmine.createSpyObj<GenericPropertyDescriptor>('resourceDescriptor',
        ['toFormFieldBuilder', 'getTitle']);
      const form = {
        getSubFields: () => []
      } as SubFormField as FormField;
      resourceDescriptor.toFormFieldBuilder.and.returnValue({
        build: () => form
      } as FormFieldBuilder);
      resourceDescriptor.getTitle.and.returnValue('Resource');

      TestBed.configureTestingModule({
        declarations: [ResourceFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: ResourceService, useValue: createSpyObj('halDocumentService', ['create', 'update'])},
          {provide: Router, useValue: createSpyObj('router', ['navigateByUrl'])},
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({
                resourceDescriptor
              } as Data)
            } as ActivatedRoute
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get title from resource descriptor', () => {
    expect(component.title).toEqual('Resource');
  });
});
