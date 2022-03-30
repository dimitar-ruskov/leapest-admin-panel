import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsInputModalComponent } from './keywords-input-modal.component';

describe('KeywordsInputModalComponent', () => {
  let component: KeywordsInputModalComponent;
  let fixture: ComponentFixture<KeywordsInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeywordsInputModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
