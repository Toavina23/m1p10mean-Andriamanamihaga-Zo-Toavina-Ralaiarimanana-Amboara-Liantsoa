import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy, OnInit {
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}
  loginForm = this.fb.group({
    email: ['toavinaandr@gmail.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(8)]],
  });
  authenticationSubscription: Subscription | null = null;
  loading = false;
  error = '';

  onSubmit() {
    this.error = '';
    console.log(this.loginForm);
    this.authenticationSubscription = this.authService
      .authenticate(
        this.email?.getRawValue(),
        this.password?.getRawValue()
      )
      .subscribe({
        next: (event) => {
          if (event?.type == HttpEventType.Sent) {
            this.loading = true;
          } else if (event?.type == HttpEventType.Response) {
            this.loading = false;
            switch (localStorage.getItem('role')) {
              case 'CLIENT':
                this.router.navigate(['/customer']);
                break;
              case 'EMPLOYEE':
                this.router.navigate(['/employee']);
                break;
              default:
                this.router.navigate(['/manager']);
                break;
            }
            // this.router.navigate(['/customer']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  ngOnDestroy(): void {
    this.authenticationSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    if (this.authService.customerSessionValid()) {
      this.router.navigate(['/customer']);
    }
  }
}
