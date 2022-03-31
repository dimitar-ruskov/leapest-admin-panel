import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableControlPanelComponent } from './table-control-panel.component';

describe('TableControlPanelComponent', () => {
  let component: TableControlPanelComponent;
  let fixture: ComponentFixture<TableControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableControlPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
