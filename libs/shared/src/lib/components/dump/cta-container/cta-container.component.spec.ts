import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaContainerComponent } from './cta-container.component';

describe('CtaContainerComponent', () => {
  let component: CtaContainerComponent;
  let fixture: ComponentFixture<CtaContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
