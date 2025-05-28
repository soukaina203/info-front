import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoppupComponent } from './poppup.component';

describe('PoppupComponent', () => {
  let component: PoppupComponent;
  let fixture: ComponentFixture<PoppupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoppupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoppupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
