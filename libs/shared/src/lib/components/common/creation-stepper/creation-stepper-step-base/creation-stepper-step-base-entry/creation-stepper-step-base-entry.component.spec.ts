import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepBaseEntryComponent } from './creation-stepper-step-base-entry.component';

describe('CreationStepperStepBaseEntryComponent', () => {
  let component: CreationStepperStepBaseEntryComponent;
  let fixture: ComponentFixture<CreationStepperStepBaseEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepBaseEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepBaseEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
