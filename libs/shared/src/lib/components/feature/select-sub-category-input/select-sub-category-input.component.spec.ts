import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSubCategoryInputComponent } from './select-sub-category-input.component';

describe('SelectSubCategoryInputComponent', () => {
  let component: SelectSubCategoryInputComponent;
  let fixture: ComponentFixture<SelectSubCategoryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSubCategoryInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSubCategoryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
