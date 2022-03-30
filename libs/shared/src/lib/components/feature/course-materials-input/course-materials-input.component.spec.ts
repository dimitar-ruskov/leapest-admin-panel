import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMaterialsInputComponent } from './course-materials-input.component';

describe('CourseMaterialsInputComponent', () => {
  let component: CourseMaterialsInputComponent;
  let fixture: ComponentFixture<CourseMaterialsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseMaterialsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseMaterialsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
