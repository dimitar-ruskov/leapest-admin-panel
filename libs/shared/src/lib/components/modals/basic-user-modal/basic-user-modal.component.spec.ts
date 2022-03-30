import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicUserModalComponent } from './basic-user-modal.component';

describe('BasicUserModalComponent', () => {
  let component: BasicUserModalComponent;
  let fixture: ComponentFixture<BasicUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
