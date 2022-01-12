import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtmmSearchComponent } from './otmm-search.component';

describe('OtmmSearchComponent', () => {
  let component: OtmmSearchComponent;
  let fixture: ComponentFixture<OtmmSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtmmSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtmmSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
