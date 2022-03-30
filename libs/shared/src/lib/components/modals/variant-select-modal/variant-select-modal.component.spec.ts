import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSelectModalComponent } from './variant-select-modal.component';

describe('VariantSelectModalComponent', () => {
  let component: VariantSelectModalComponent;
  let fixture: ComponentFixture<VariantSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
