import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCourseCertificateComponent } from './edit-course-certificate.component';

describe('EditCourseCertificateComponent', () => {
  let component: EditCourseCertificateComponent;
  let fixture: ComponentFixture<EditCourseCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCourseCertificateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
