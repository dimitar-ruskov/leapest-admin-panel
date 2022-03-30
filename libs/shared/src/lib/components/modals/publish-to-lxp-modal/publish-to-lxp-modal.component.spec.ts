import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishToLxpModalComponent } from './publish-to-lxp-modal.component';

describe('PublishToLxpModalComponent', () => {
  let component: PublishToLxpModalComponent;
  let fixture: ComponentFixture<PublishToLxpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishToLxpModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishToLxpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
