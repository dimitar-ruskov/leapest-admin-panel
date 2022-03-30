import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSubCategoryModalComponent } from './select-sub-category-modal.component';

describe('AddSubCategoryModalComponent', () => {
  let component: SelectSubCategoryModalComponent;
  let fixture: ComponentFixture<SelectSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSubCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
