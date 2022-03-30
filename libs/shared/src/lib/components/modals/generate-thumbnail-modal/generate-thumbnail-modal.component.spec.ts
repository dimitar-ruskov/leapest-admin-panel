import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateThumbnailModalComponent } from './generate-thumbnail-modal.component';

describe('GenerateThumbnailModalComponent', () => {
  let component: GenerateThumbnailModalComponent;
  let fixture: ComponentFixture<GenerateThumbnailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateThumbnailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateThumbnailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
