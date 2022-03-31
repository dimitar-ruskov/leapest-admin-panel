import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepBodyComponent } from './creation-stepper-step-body.component';

describe('CreationStepperStepBodyComponent', () => {
  let component: CreationStepperStepBodyComponent;
  let fixture: ComponentFixture<CreationStepperStepBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
