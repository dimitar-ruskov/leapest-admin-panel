import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLanguageModalComponent } from './edit-language-modal.component';

describe('EditLanguageModalComponent', () => {
  let component: EditLanguageModalComponent;
  let fixture: ComponentFixture<EditLanguageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLanguageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLanguageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
