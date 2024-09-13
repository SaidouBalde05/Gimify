// import { Component } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {

//   firstName: string = ''; 
//   lastName: string = '';  
//   username: string = '';
//   password: string = '';
//   role: any = 'user';
//   id!: number;
//   purchasedMusicIds!: [] 
//   acceptedTerms: boolean = false; // Pour la case à cocher des conditions d'utilisation
//   registrationError: string | null = null;
//   passwordFieldType: string = 'password';

//   constructor(private authService: AuthService, private router: Router) {}
//   togglePasswordVisibility(): void {
//     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
//   }

//   onSubmit(): void {
//     if (!this.acceptedTerms) {
//       this.registrationError = "Vous devez accepter les conditions d'utilisation avant de créer un compte.";
//       return;
//     }
//     if (this.acceptedTerms) {
//       const userData = {
//         firstName: this.firstName,  
//         lastName: this.lastName,    
//         username: this.username,
//         password: this.password,
//         role: this.role,
//         id: this.id ,
//         purchasedMusicIds: this.purchasedMusicIds

//       };

//       this.authService.addUser(userData).subscribe(
//         response => {
//           // Gérer la réponse, par exemple rediriger vers la page de connexion
//           console.log('Utilisateur ajouté avec succès', response);
//           this.router.navigate(['/user-dashboard']);
//         },
//         error => {
//           // Gérer l'erreur, par exemple afficher un message d'erreur
//           console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
//           this.registrationError = 'Erreur lors de l\'ajout de l\'utilisateur';
//         }
//       );
//     } else {
//       this.registrationError = "Vous devez accepter les conditions d'utilisation.";
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  firstName: string = ''; 
  lastName: string = '';  
  username: string = '';
  password: string = '';
  role: string = 'user';  // Le rôle par défaut
  id!: number;
  phoneNumber: any ;
  purchasedMusicIds: any[] = []; 
  acceptedTerms: boolean = false;
  registrationError: string | null = null;
  passwordFieldType: string = 'password';
  isAdmin: boolean = false;  // Ajout d'un indicateur pour vérifier si l'utilisateur est un administrateur

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();  // Déterminez si l'utilisateur est un administrateur
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    if (!this.acceptedTerms) {
      this.registrationError = "Vous devez accepter les conditions d'utilisation avant de créer un compte.";
      return;
    }
  
    // Assurez-vous que `role` est correctement typé
    const userData: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      phoneNumber: this.phoneNumber,
      role: this.role as 'admin' | 'user', // Cast pour s'assurer que `role` est de type correct
      id: this.id,
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
  }
  
}
