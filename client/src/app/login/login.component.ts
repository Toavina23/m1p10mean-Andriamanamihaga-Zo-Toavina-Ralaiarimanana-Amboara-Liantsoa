import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private fb: FormBuilder) {}
  loginForm = this.fb.group({
    email: [
      'zotoavina.andria@gmail.com',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    console.log(this.loginForm);
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
