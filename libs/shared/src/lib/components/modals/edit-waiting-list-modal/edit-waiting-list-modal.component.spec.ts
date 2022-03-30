import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWaitingListModalComponent } from './edit-waiting-list-modal.component';

describe('EditWaitingListModalComponent', () => {
  let component: EditWaitingListModalComponent;
  let fixture: ComponentFixture<EditWaitingListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWaitingListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWaitingListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
