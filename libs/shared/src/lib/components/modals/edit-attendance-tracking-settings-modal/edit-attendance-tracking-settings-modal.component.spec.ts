import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttendanceTrackingSettingsModalComponent } from './edit-attendance-tracking-settings-modal.component';

describe('EditAttendanceTrackingSettingsModalComponent', () => {
  let component: EditAttendanceTrackingSettingsModalComponent;
  let fixture: ComponentFixture<EditAttendanceTrackingSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAttendanceTrackingSettingsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendanceTrackingSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
