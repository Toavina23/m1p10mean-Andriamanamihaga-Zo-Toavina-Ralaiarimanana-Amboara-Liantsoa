import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../password.validator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  signupForm = this.fb.group(
    {
      email: ['toavinaandr@gmail.com', [Validators.required, Validators.email]],
      firstname: [
        'Andria',
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      lastname: [
        'Rabe',
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      password: ['password123', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['password123', [Validators.required]],
    },
    { validators: confirmPasswordValidator }
  );

  emailValidationForm = this.fb.group({
    code: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  error: string = '';
  loading: boolean = false;
  userId: string | null = null;

  step: 'information' | 'emailValidation' = 'information';

  onSubmit() {
    this.authService
      .registerClient(
        this.email?.getRawValue(),
        this.password?.getRawValue(),
        this.firstname?.getRawValue(),
        this.lastname?.getRawValue()
      )
      .subscribe({
        next: (event) => {
          if (event?.type == HttpEventType.Sent) {
            this.loading = true;
          } else if (event?.type == HttpEventType.Response) {
            this.loading = false;
            this.step = 'emailValidation';
            this.userId = event.body?.userId!;
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
  }
  onEmailValidationSubmit() {
    this.authService
      .verifyUserEmail(this.code?.getRawValue(), this.userId!)
      .subscribe({
        next: (event) => {
          if (event?.type == HttpEventType.Sent) {
            this.loading = true;
          } else if (event?.type == HttpEventType.Response) {
            this.loading = false;
            this.router.navigate(['/customer']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
  }
  onResendCode() {
    this.authService.resendValidationCode(this.userId!).subscribe({
      next: (event) => {
        if (event?.type == HttpEventType.Response) {
          alert('Code renvoyé');
        }
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
  get password() {
    return this.signupForm.get('password');
  }
  get firstname() {
    return this.signupForm.get('firstname');
  }
  get lastname() {
    return this.signupForm.get('lastname');
  }

  get passwordConfirmation() {
    return this.signupForm.get('passwordConfirmation');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get code() {
    return this.emailValidationForm.get('code');
  }
}
