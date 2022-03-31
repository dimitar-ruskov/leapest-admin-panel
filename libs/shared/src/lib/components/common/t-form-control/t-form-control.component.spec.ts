import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TFormControlComponent } from './t-form-control.component';

describe('TFormControlComponent', () => {
  let component: TFormControlComponent;
  let fixture: ComponentFixture<TFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
