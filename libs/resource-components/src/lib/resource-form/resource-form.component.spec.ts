import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceFormComponent} from './resource-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {GenericPropertyDescriptor, ResourceService} from 'hateoas-navigator';
import {ActivatedRoute, Data, provideRoutes} from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import {SubFormField} from 'hateoas-navigator';
import {FormFieldBuilder} from 'hateoas-navigator';
import {FormField} from 'hateoas-navigator';
import {of} from 'rxjs';
import {CustomComponentService} from '../customizable/custom-component.service';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  beforeEach(async () => {
      const resourceDescriptor = jasmine.createSpyObj<GenericPropertyDescriptor>('resourceDescriptor',
        ['toFormFieldBuilder', 'getTitle']);
      const form = {
        getSubFields: () => []
      } as unknown as SubFormField as FormField;
      resourceDescriptor.toFormFieldBuilder.and.returnValue({
        build: () => form
      } as FormFieldBuilder);
      resourceDescriptor.getTitle.and.returnValue('Resource');

      await TestBed.configureTestingModule({
        imports: [ResourceFormComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {provide: ResourceService, useValue: createSpyObj('halDocumentService', ['create', 'update'])},
          provideRoutes([]),
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({
                resourceDescriptor
              } as Data)
            } as ActivatedRoute
          },
          {provide: CustomComponentService, useFactory: () => new CustomComponentService([])}
        ]
      }).compileComponents();
    }
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
