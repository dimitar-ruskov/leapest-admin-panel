import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstructorsModalComponent } from './edit-instructors-modal.component';

describe('EditInstructorsModalComponent', () => {
  let component: EditInstructorsModalComponent;
  let fixture: ComponentFixture<EditInstructorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInstructorsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstructorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
