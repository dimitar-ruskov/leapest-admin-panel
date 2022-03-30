import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryInputComponent } from './select-category-input.component';

describe('SelectCategoryInputComponent', () => {
  let component: SelectCategoryInputComponent;
  let fixture: ComponentFixture<SelectCategoryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCategoryInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
