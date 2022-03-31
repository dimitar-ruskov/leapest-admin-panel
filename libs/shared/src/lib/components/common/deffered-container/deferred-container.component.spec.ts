import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferredContainerComponent } from './deferred-container.component';

describe('DefferedContainerComponent', () => {
  let component: DeferredContainerComponent;
  let fixture: ComponentFixture<DeferredContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferredContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferredContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
