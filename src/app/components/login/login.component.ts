import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        const user = this.authService.currentUserValue;
        if (user?.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      } else {
        this.loginError = 'Invalid username or password';
      }
    });
  }

  // username: string = '';
  // password: string = '';
  // loginError: string | null = null;

  // constructor(private authService: AuthService, private router: Router) {}

  // onSubmit(): void {
  //   if (this.authService.login(this.username, this.password)) {
  //     const user = this.authService.currentUserValue;
  //     if (user?.role === 'admin') {
  //       this.router.navigate(['/admin-dashboard']);
  //     } else {
  //       this.router.navigate(['/user-dashboard']);
  //     }
  //   } else {
  //     this.loginError = 'Invalid username or password';
  //   }
  // }

}
