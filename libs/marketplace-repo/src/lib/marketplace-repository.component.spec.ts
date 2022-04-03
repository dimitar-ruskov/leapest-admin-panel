import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceRepositoryComponent } from './marketplace-repository.component';

describe('MarketplaceRepositoryComponent', () => {
  let component: MarketplaceRepositoryComponent;
  let fixture: ComponentFixture<MarketplaceRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketplaceRepositoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
