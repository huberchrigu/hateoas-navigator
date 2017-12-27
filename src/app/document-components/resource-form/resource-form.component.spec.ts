import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceFormComponent} from './resource-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {ActivatedRoute, Data, Router} from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {FormField} from '@hal-navigator/schema/form/form-field';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  beforeEach(async(() => {
      const resourceDescriptor = jasmine.createSpyObj<ResourceDescriptor>('resourceDescriptor', ['toFormField', 'getTitle']);
      resourceDescriptor.toFormField.and.returnValue({
        options: {
          getSubFields: () => []
        }
      } as FormField);
      resourceDescriptor.getTitle.and.returnValue('Resource');

      TestBed.configureTestingModule({
        declarations: [ResourceFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: HalDocumentService, useValue: createSpyObj('halDocumentService', ['create', 'update'])},
          {provide: Router, useValue: createSpyObj('router', ['navigateByUrl'])},
          {
            provide: ActivatedRoute,
            useValue: {
              data: Observable.of({
                resourceDescriptor: resourceDescriptor
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
