import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsCollisionsWarningsComponent } from './instructors-collisions-warnings.component';

describe('InstructorsCollisionsWarningsComponent', () => {
  let component: InstructorsCollisionsWarningsComponent;
  let fixture: ComponentFixture<InstructorsCollisionsWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorsCollisionsWarningsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorsCollisionsWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
