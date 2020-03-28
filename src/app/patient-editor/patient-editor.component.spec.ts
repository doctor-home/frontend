import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditorComponent } from './patient-editor.component';

describe('PatientEditorComponent', () => {
  let component: PatientEditorComponent;
  let fixture: ComponentFixture<PatientEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
