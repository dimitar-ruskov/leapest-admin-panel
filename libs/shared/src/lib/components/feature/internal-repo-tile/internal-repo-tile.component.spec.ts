import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalRepoTileComponent } from './internal-repo-tile.component';

describe('InternalRepoTileComponent', () => {
  let component: InternalRepoTileComponent;
  let fixture: ComponentFixture<InternalRepoTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalRepoTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalRepoTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
