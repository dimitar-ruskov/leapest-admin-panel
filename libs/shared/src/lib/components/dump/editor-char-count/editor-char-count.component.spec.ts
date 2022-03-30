import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCharCountComponent } from './editor-char-count.component';

describe('EditorCharCountComponent', () => {
  let component: EditorCharCountComponent;
  let fixture: ComponentFixture<EditorCharCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorCharCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorCharCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
