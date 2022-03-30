import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTrackingDetailsModalComponent } from './materials-tracking-details-modal.component';

describe('MaterialsTrackingDetailsModalComponent', () => {
  let component: MaterialsTrackingDetailsModalComponent;
  let fixture: ComponentFixture<MaterialsTrackingDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsTrackingDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTrackingDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
