import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCourseModalComponent } from './create-new-course-modal.component';

describe('CreateNewCourseModalComponent', () => {
  let component: CreateNewCourseModalComponent;
  let fixture: ComponentFixture<CreateNewCourseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewCourseModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
