import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfoThumbnailBoxComponent } from './general-info-thumbnail-box.component';

describe('GeneralInfoThumbnailBoxComponent', () => {
  let component: GeneralInfoThumbnailBoxComponent;
  let fixture: ComponentFixture<GeneralInfoThumbnailBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralInfoThumbnailBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInfoThumbnailBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
