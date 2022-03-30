import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVirtualMeetingsModalComponent } from './edit-virtual-meetings-modal.component';

describe('EditVirtualMeetingsModalComponent', () => {
  let component: EditVirtualMeetingsModalComponent;
  let fixture: ComponentFixture<EditVirtualMeetingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditVirtualMeetingsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVirtualMeetingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
