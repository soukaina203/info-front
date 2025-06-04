import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursEnLignesComponent } from './cours-en-lignes.component';

describe('CoursEnLignesComponent', () => {
  let component: CoursEnLignesComponent;
  let fixture: ComponentFixture<CoursEnLignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursEnLignesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursEnLignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
