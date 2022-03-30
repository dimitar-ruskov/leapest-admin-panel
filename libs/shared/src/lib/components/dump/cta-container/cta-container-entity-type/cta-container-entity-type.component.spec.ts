import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaContainerEntityTypeComponent } from './cta-container-entity-type.component';

describe('CtaContainerEntityTypeComponent', () => {
  let component: CtaContainerEntityTypeComponent;
  let fixture: ComponentFixture<CtaContainerEntityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaContainerEntityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaContainerEntityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
