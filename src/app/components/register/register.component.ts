import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  role: string = 'user';
  registrationError: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    const userData = {
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.authService.addUser(userData).subscribe(
      response => {
        // Gérer la réponse, par exemple rediriger vers la page de connexion
        console.log('Utilisateur ajouté avec succès', response);
        // Réinitialiser le formulaire ou afficher un message de succès
      },
      error => {
        // Gérer l'erreur, par exemple afficher un message d'erreur
        console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        this.registrationError = 'Erreur lors de l\'ajout de l\'utilisateur';
      }
    );
  }

  // username: string = '';
  // password: string = '';
  // role: 'admin' | 'user' = 'user';

  // constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   if (!this.authService.isAdmin()) {
  //     alert('Access denied. Only administrators can create new accounts.');
  //     this.router.navigate(['/login']);
  //   }
  // }
  

  // onSubmit(): void {
  //   if (this.authService.isAdmin()) {
  //     this.authService.register(this.username, this.password, this.role);
  //     alert(`Account for ${this.username} created successfully!`);
  //     this.router.navigate(['/admin-dashboard']);
  //   } else {
  //     alert('Only administrators can create new accounts.');
  //   }
  // }
}
