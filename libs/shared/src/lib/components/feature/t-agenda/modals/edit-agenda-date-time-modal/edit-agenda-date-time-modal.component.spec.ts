import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgendaDateTimeModalComponent } from './edit-agenda-date-time-modal.component';

describe('EditAgendaDateTimeModalComponent', () => {
  let component: EditAgendaDateTimeModalComponent;
  let fixture: ComponentFixture<EditAgendaDateTimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgendaDateTimeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgendaDateTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
