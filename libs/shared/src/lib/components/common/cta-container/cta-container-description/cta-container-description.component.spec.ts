import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaContainerDescriptionComponent } from './cta-container-description.component';

describe('CtaContainerDescriptionComponent', () => {
  let component: CtaContainerDescriptionComponent;
  let fixture: ComponentFixture<CtaContainerDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaContainerDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaContainerDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
