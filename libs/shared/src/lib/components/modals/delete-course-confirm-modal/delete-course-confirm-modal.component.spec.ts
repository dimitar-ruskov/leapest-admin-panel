import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCourseConfirmModalComponent } from './delete-course-confirm-modal.component';

describe('DeleteCourseConfirmModalComponent', () => {
  let component: DeleteCourseConfirmModalComponent;
  let fixture: ComponentFixture<DeleteCourseConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCourseConfirmModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCourseConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
