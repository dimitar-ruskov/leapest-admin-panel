import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMenuComponent } from './t-menu.component';

describe('TMenuComponent', () => {
  let component: TMenuComponent;
  let fixture: ComponentFixture<TMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
