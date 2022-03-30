import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrainingManagerModalComponent } from './edit-training-manager-modal.component';

describe('EditTrainingManagerModalComponent', () => {
  let component: EditTrainingManagerModalComponent;
  let fixture: ComponentFixture<EditTrainingManagerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTrainingManagerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrainingManagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
