import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepSummaryComponent } from './creation-stepper-step-summary.component';

describe('CreationStepperStepSummaryComponent', () => {
  let component: CreationStepperStepSummaryComponent;
  let fixture: ComponentFixture<CreationStepperStepSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
