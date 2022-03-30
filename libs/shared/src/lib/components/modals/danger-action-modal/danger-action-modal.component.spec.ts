import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerActionModalComponent } from './danger-action-modal.component';

describe('DangerActionModalComponent', () => {
  let component: DangerActionModalComponent;
  let fixture: ComponentFixture<DangerActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DangerActionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
