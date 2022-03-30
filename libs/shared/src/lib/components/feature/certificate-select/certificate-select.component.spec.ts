import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateSelectComponent } from './certificate-select.component';

describe('CertificateSelectComponent', () => {
  let component: CertificateSelectComponent;
  let fixture: ComponentFixture<CertificateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
