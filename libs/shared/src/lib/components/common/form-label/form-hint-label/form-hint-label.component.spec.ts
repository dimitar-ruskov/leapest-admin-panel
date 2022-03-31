import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHintLabelComponent } from './form-hint-label.component';

describe('FormHintLabelComponent', () => {
  let component: FormHintLabelComponent;
  let fixture: ComponentFixture<FormHintLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHintLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHintLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
