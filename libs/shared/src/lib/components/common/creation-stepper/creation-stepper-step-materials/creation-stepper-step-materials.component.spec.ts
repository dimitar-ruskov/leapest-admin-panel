import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepperStepMaterialsComponent } from './creation-stepper-step-materials.component';

describe('CreationStepperStepMaterialsComponent', () => {
  let component: CreationStepperStepMaterialsComponent;
  let fixture: ComponentFixture<CreationStepperStepMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStepperStepMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStepperStepMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
