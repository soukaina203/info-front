import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailVerificationComponent } from './mail-verification.component';

describe('MailVerificationComponent', () => {
  let component: MailVerificationComponent;
  let fixture: ComponentFixture<MailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
