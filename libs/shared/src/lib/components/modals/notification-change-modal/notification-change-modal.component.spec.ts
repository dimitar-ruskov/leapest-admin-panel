import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationChangeModalComponent } from './notification-change-modal.component';

describe('NotificationChangeModalComponent', () => {
  let component: NotificationChangeModalComponent;
  let fixture: ComponentFixture<NotificationChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationChangeModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
