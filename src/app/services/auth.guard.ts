import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }
    this.router.navigate(['/']); // Rediriger vers la page d'accueil si non autorisé
    return false;
  }

  // constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   const currentUser = this.authService.currentUserValue;
  //   if (currentUser) {
  //     return true;  // L'utilisateur est connecté, autoriser l'accès
  //   }

  //   this.router.navigate(['/login']);  // Redirection vers la page de connexion
  //   return false;  // Interdire l'accès
  // }

}
