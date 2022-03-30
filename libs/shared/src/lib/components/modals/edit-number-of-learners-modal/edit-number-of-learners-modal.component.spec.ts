import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNumberOfLearnersModalComponent } from './edit-number-of-learners-modal.component';

describe('EditNumberOfLearnersModalComponent', () => {
  let component: EditNumberOfLearnersModalComponent;
  let fixture: ComponentFixture<EditNumberOfLearnersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNumberOfLearnersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNumberOfLearnersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
