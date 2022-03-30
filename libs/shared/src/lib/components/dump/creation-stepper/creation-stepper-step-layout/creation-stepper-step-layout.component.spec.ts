import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepLayoutComponent } from './creation-stepper-step-layout.component';

describe('CreationStepperStepLayoutComponent', () => {
  let component: CreationStepperStepLayoutComponent;
  let fixture: ComponentFixture<CreationStepperStepLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
