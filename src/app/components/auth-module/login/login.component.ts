import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  phoneNumber: any
  loginError: string | null = null;
  passwordFieldType: string = 'password';  // Par défaut, le type du champ est "password"

  constructor(private authService: AuthService, private router: Router) {}
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password, this.phoneNumber ).subscribe(success => {
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
