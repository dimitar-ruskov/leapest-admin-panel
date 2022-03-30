import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEventConfirmModalComponent } from './cancel-event-confirm-modal.component';

describe('CancelEventConfirmModalComponent', () => {
  let component: CancelEventConfirmModalComponent;
  let fixture: ComponentFixture<CancelEventConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelEventConfirmModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEventConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
