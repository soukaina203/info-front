import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutienScolaireComponent } from './soutien-scolaire.component';

describe('SoutienScolaireComponent', () => {
  let component: SoutienScolaireComponent;
  let fixture: ComponentFixture<SoutienScolaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoutienScolaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoutienScolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
