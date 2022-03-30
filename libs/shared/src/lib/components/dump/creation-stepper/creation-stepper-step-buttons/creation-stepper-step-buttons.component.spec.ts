import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepButtonsComponent } from './creation-stepper-step-buttons.component';

describe('CreationStepperStepButtonsComponent', () => {
  let component: CreationStepperStepButtonsComponent;
  let fixture: ComponentFixture<CreationStepperStepButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
