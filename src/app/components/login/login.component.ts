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
  passwordFieldType: string = 'password';  // Par défaut, le type du champ est "password"

  constructor(private authService: AuthService, private router: Router) {}
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password ).subscribe(success => {
      if (success) {
        const user = this.authService.currentUserValue;
        if (user?.role === 'admin') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/admin-dashboard']); 
        }
      } else {
        this.loginError = 'Identifiants incorrecte';
      }
    });
  }
}
