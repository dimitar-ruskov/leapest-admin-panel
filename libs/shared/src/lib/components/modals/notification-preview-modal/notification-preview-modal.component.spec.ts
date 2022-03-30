import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreviewModalComponent } from './notification-preview-modal.component';

describe('NotificationPreviewModalComponent', () => {
  let component: NotificationPreviewModalComponent;
  let fixture: ComponentFixture<NotificationPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationPreviewModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
