import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaContainerTitleComponent } from './cta-container-title.component';

describe('CtaContainerTitleComponent', () => {
  let component: CtaContainerTitleComponent;
  let fixture: ComponentFixture<CtaContainerTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaContainerTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaContainerTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
