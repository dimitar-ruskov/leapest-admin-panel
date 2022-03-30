import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPassRateModalComponent } from './edit-pass-rate-modal.component';

describe('EditPassRateModalComponent', () => {
  let component: EditPassRateModalComponent;
  let fixture: ComponentFixture<EditPassRateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPassRateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPassRateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
