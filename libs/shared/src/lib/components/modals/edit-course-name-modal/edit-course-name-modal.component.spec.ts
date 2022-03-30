import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCourseNameModalComponent } from './edit-course-name-modal.component';

describe('EditCourseNameModalComponent', () => {
  let component: EditCourseNameModalComponent;
  let fixture: ComponentFixture<EditCourseNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCourseNameModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
