import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHeaderSectionsComponent } from './event-header-sections.component';

describe('EventHeaderSectionsComponent', () => {
  let component: EventHeaderSectionsComponent;
  let fixture: ComponentFixture<EventHeaderSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventHeaderSectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventHeaderSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
