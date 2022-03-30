import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGridTitleCellComponent } from './table-grid-title-cell.component';

describe('TableGridTitleCellComponent', () => {
  let component: TableGridTitleCellComponent;
  let fixture: ComponentFixture<TableGridTitleCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableGridTitleCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableGridTitleCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
