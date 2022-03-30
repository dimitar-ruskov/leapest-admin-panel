import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimezoneModalComponent } from './edit-timezone-modal.component';

describe('EditTimezoneModalComponent', () => {
  let component: EditTimezoneModalComponent;
  let fixture: ComponentFixture<EditTimezoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimezoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTimezoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
