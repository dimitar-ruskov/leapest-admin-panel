import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryModalComponent } from './select-category-modal.component';

describe('SelectCategoryModalComponent', () => {
  let component: SelectCategoryModalComponent;
  let fixture: ComponentFixture<SelectCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
