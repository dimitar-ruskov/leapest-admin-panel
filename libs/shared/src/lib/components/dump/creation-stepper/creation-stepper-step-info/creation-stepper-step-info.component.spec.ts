import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepInfoComponent } from './creation-stepper-step-info.component';

describe('CreationStepperStepInfoComponent', () => {
  let component: CreationStepperStepInfoComponent;
  let fixture: ComponentFixture<CreationStepperStepInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
