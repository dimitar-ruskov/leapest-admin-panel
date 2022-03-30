import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAttendanceTrackingSelectionModalComponent } from './bulk-attendance-tracking-selection-modal.component';

describe('BulkAttendanceTrackingSelectionModalComponent', () => {
  let component: BulkAttendanceTrackingSelectionModalComponent;
  let fixture: ComponentFixture<BulkAttendanceTrackingSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAttendanceTrackingSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAttendanceTrackingSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
