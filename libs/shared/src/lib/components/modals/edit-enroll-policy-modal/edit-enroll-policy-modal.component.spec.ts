import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnrollPolicyModalComponent } from './edit-enroll-policy-modal.component';

describe('EditEnrollPolicyModalComponent', () => {
  let component: EditEnrollPolicyModalComponent;
  let fixture: ComponentFixture<EditEnrollPolicyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEnrollPolicyModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnrollPolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
