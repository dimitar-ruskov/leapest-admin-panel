import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAgendaSectionModalComponent } from './t-agenda-section-modal.component';

describe('TAgendaSectionModalComponent', () => {
  let component: TAgendaSectionModalComponent;
  let fixture: ComponentFixture<TAgendaSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TAgendaSectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAgendaSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
