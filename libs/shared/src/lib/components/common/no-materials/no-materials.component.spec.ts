import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMaterialsComponent } from './no-materials.component';

describe('NoMaterialsComponent', () => {
  let component: NoMaterialsComponent;
  let fixture: ComponentFixture<NoMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
