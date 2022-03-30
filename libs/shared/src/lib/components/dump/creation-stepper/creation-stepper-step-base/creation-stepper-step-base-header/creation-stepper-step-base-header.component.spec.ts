import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepBaseHeaderComponent } from './creation-stepper-step-base-header.component';

describe('CreationStepperStepBaseHeaderComponent', () => {
  let component: CreationStepperStepBaseHeaderComponent;
  let fixture: ComponentFixture<CreationStepperStepBaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepBaseHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepBaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
