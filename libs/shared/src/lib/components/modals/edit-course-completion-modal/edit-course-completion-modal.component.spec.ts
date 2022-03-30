import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCourseCompletionModalComponent } from './edit-course-completion-modal.component';

describe('EditCourseCompletionModalComponent', () => {
  let component: EditCourseCompletionModalComponent;
  let fixture: ComponentFixture<EditCourseCompletionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCourseCompletionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseCompletionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
