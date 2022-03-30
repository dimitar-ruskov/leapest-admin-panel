import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInputModalComponent } from './select-input-modal.component';

describe('SelectInputModalComponent', () => {
  let component: SelectInputModalComponent;
  let fixture: ComponentFixture<SelectInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectInputModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
