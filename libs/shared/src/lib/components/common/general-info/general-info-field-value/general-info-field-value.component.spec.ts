import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfoFieldValueComponent } from './general-info-field-value.component';

describe('GeneralInfoFieldValueComponent', () => {
  let component: GeneralInfoFieldValueComponent;
  let fixture: ComponentFixture<GeneralInfoFieldValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInfoFieldValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInfoFieldValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
