import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceFormComponent} from './resource-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {ActivatedRoute, Data, Router} from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import {Observable} from 'rxjs/Observable';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  beforeEach(async(() => {
      const schemaMock = createSpyObj('schemaAdapter', ['getFields', 'getTitle', 'asControls']);
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
                schemaAdapter: schemaMock
              } as Data)
            } as ActivatedRoute
          }
        ]
      }).compileComponents();

      schemaMock.asControls.and.returnValue([]);
    })
  )
  ;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
;
