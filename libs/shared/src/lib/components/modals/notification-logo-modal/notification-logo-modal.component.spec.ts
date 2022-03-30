import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationLogoModalComponent } from './notification-logo-modal.component';

describe('NotificationLogoModalComponent', () => {
  let component: NotificationLogoModalComponent;
  let fixture: ComponentFixture<NotificationLogoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationLogoModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationLogoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
