import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceRepositoryListComponent } from './marketplace-repository-list.component';

describe('MarketplaceRepositoryListComponent', () => {
  let component: MarketplaceRepositoryListComponent;
  let fixture: ComponentFixture<MarketplaceRepositoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketplaceRepositoryListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceRepositoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
