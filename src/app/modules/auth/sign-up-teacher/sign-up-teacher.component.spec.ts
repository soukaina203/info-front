import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpTeacherComponent } from './sign-up-teacher.component';

describe('SignUpTeacherComponent', () => {
  let component: SignUpTeacherComponent;
  let fixture: ComponentFixture<SignUpTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpTeacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignUpTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
