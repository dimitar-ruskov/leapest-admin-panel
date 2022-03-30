import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGridDetailsCellComponent } from './table-grid-details-cell.component';

describe('TableGridDetailsCellComponent', () => {
  let component: TableGridDetailsCellComponent;
  let fixture: ComponentFixture<TableGridDetailsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableGridDetailsCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableGridDetailsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
