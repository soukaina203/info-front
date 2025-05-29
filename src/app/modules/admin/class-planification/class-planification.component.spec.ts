import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanificationComponent } from './class-planification.component';

describe('ClassPlanificationComponent', () => {
  let component: ClassPlanificationComponent;
  let fixture: ComponentFixture<ClassPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
