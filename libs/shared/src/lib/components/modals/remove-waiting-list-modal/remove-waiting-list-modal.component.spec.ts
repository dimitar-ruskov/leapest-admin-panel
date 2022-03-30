import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWaitingListModalComponent } from './remove-waiting-list-modal.component';

describe('RemoveWaitingListModalComponent', () => {
  let component: RemoveWaitingListModalComponent;
  let fixture: ComponentFixture<RemoveWaitingListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveWaitingListModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveWaitingListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
