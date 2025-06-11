import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursLangueComponent } from './cours-langue.component';

describe('CoursLangueComponent', () => {
  let component: CoursLangueComponent;
  let fixture: ComponentFixture<CoursLangueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursLangueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursLangueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
