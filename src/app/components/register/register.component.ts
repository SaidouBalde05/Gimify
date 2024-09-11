import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  firstName: string = ''; 
  lastName: string = '';  
  username: string = '';
  password: string = '';
  role: any = 'user';
  id!: number;
  // purchasedMusicIds!: number[];
  purchasedMusicIds!: [] 
  acceptedTerms: boolean = false; // Pour la case à cocher des conditions d'utilisation
  registrationError: string | null = null;
  passwordFieldType: string = 'password';

  constructor(private authService: AuthService, private router: Router) {}
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    if (!this.acceptedTerms) {
      this.registrationError = "Vous devez accepter les conditions d'utilisation avant de créer un compte.";
      return;
    }
    if (this.acceptedTerms) {
      const userData = {
        firstName: this.firstName,  
        lastName: this.lastName,    
        username: this.username,
        password: this.password,
        role: this.role,
        id: this.id ,
        purchasedMusicIds: this.purchasedMusicIds

      };

      this.authService.addUser(userData).subscribe(
        response => {
          // Gérer la réponse, par exemple rediriger vers la page de connexion
          console.log('Utilisateur ajouté avec succès', response);
          this.router.navigate(['/user-dashboard']);
        },
        error => {
          // Gérer l'erreur, par exemple afficher un message d'erreur
          console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
          this.registrationError = 'Erreur lors de l\'ajout de l\'utilisateur';
        }
      );
    } else {
      this.registrationError = "Vous devez accepter les conditions d'utilisation.";
    }
  }
}