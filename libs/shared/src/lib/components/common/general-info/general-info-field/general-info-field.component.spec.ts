import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfoFieldComponent } from './general-info-field.component';

describe('GeneralInfoFieldComponent', () => {
  let component: GeneralInfoFieldComponent;
  let fixture: ComponentFixture<GeneralInfoFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInfoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInfoFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
