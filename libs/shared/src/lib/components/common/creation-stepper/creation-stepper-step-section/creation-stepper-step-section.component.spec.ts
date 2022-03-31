import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepSectionComponent } from './creation-stepper-step-section.component';

describe('CreationStepperStepSectionComponent', () => {
  let component: CreationStepperStepSectionComponent;
  let fixture: ComponentFixture<CreationStepperStepSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
