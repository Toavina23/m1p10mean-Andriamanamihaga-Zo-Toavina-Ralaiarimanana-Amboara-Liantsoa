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
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      password: ['password123', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['password123', [Validators.required]],
    },
    { validators: confirmPasswordValidator }
  );

  error = '';
  loading = false;

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
            this.router.navigate(['/customer']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error;
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
}
