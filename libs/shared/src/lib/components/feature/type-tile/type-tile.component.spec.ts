import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTileComponent } from './type-tile.component';

describe('TypeTileComponent', () => {
  let component: TypeTileComponent;
  let fixture: ComponentFixture<TypeTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
