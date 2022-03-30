import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConferenceLinkModalComponent } from './edit-conference-link-modal.component';

describe('EditConferenceLinkModalComponent', () => {
  let component: EditConferenceLinkModalComponent;
  let fixture: ComponentFixture<EditConferenceLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConferenceLinkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConferenceLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
