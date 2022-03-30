import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInternalRepoNameModalComponent } from './edit-internal-repo-name-modal.component';

describe('EditInternalRepoNameModalComponent', () => {
  let component: EditInternalRepoNameModalComponent;
  let fixture: ComponentFixture<EditInternalRepoNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditInternalRepoNameModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInternalRepoNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
