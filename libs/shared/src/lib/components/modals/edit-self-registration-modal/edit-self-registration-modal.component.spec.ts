import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelfRegistrationModalComponent } from './edit-self-registration-modal.component';

describe('EditSelfRegistrationModalComponent', () => {
  let component: EditSelfRegistrationModalComponent;
  let fixture: ComponentFixture<EditSelfRegistrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSelfRegistrationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelfRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
