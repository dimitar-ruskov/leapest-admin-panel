import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepBaseComponent } from './creation-stepper-step-base.component';

describe('CreationStepperStepBaseComponent', () => {
  let component: CreationStepperStepBaseComponent;
  let fixture: ComponentFixture<CreationStepperStepBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
