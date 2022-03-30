import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAgendaComponent } from './t-agenda.component';

describe('TAgendaComponent', () => {
  let component: TAgendaComponent;
  let fixture: ComponentFixture<TAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
