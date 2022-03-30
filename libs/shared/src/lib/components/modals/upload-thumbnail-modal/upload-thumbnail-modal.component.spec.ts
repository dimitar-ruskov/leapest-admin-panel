import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadThumbnailModalComponent } from './upload-thumbnail-modal.component';

describe('UploadThumbnailModalComponent', () => {
  let component: UploadThumbnailModalComponent;
  let fixture: ComponentFixture<UploadThumbnailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadThumbnailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadThumbnailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
