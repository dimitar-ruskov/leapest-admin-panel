import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationLoaderModalComponent } from './creation-loader-modal.component';

describe('CreationLoaderModalComponent', () => {
  let component: CreationLoaderModalComponent;
  let fixture: ComponentFixture<CreationLoaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationLoaderModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationLoaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
