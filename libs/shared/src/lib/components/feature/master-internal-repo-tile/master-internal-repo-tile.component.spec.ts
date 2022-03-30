import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInternalRepoTileComponent } from './master-internal-repo-tile.component';

describe('MasterInternalRepoTileComponent', () => {
  let component: MasterInternalRepoTileComponent;
  let fixture: ComponentFixture<MasterInternalRepoTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterInternalRepoTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterInternalRepoTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
