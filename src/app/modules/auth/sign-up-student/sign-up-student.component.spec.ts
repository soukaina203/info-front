import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStudentComponent } from './sign-up-student.component';

describe('SignUpStudentComponent', () => {
  let component: SignUpStudentComponent;
  let fixture: ComponentFixture<SignUpStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignUpStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
