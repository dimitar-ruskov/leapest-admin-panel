import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepHeaderComponent } from './creation-stepper-step-header.component';

describe('CreationStepperStepHeaderComponent', () => {
  let component: CreationStepperStepHeaderComponent;
  let fixture: ComponentFixture<CreationStepperStepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
