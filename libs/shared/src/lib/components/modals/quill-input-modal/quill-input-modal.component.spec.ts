import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillInputModalComponent } from './quill-input-modal.component';

describe('QuillInputModalComponent', () => {
  let component: QuillInputModalComponent;
  let fixture: ComponentFixture<QuillInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuillInputModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
