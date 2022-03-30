import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseMaterialModalComponent } from './add-course-material-modal.component';

describe('AddCourseMaterialModalComponent', () => {
  let component: AddCourseMaterialModalComponent;
  let fixture: ComponentFixture<AddCourseMaterialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCourseMaterialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
