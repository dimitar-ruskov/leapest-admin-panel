import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExternalSKUModalComponent } from './edit-external-sku-modal.component';

describe('EditExternalSKUModalComponent', () => {
  let component: EditExternalSKUModalComponent;
  let fixture: ComponentFixture<EditExternalSKUModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditExternalSKUModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExternalSKUModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
