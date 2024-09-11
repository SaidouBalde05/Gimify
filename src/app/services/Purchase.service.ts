import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchasedMusicIds: Set<string> = new Set<string>();
  private apiUrl = 'http://localhost:3000/sales';
  private usersUrl = 'http://localhost:3000/users';
  private isProcessingPurchase = false; // Ajout d'un verrou pour éviter les achats multiples

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Récupère les achats de l'utilisateur connecté
  getUserPurchases(userId: string): Observable<string[]> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      map(user => user.purchasedMusicIds || []),
      catchError((error) => {
        console.error('Erreur lors de la récupération des achats', error);
        return of([]);
      })
    ) 
  }
  deletePurchase(userId: string, musicId: string): Observable<any> {
    // Récupérer l'utilisateur depuis l'API
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      switchMap(user => {
        // Supprimer l'ID de la musique de la liste purchasedMusicIds
        const updatedPurchasedMusicIds = user.purchasedMusicIds.filter((id: string) => id !== musicId);
        
        // Mettre à jour l'utilisateur avec la nouvelle liste de musiques achetées
        const updatedUser = { ...user, purchasedMusicIds: updatedPurchasedMusicIds };
  
        // Envoyer la mise à jour au serveur
        return this.http.put(`${this.usersUrl}/${userId}`, updatedUser);
      })
    );
  }
  
  
  

  purchaseMusic(purchase: { musicId: string; musicTitle: string; date: string }): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }
  // Vérifie si l'album a déjà été acheté
  isPurchased(musicId: string): boolean {
    return this.purchasedMusicIds.has(musicId);
  }

  // Mise à jour des achats de l'utilisateur (ajout ou suppression d'un album)
  private updateUserPurchases(userId: string, musicId: string, remove: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      switchMap(user => {
        const updatedPurchases = remove
          ? user.purchasedMusicIds.filter((id: string) => id !== musicId) // Retire l'ID de l'album
          : [...new Set([...user.purchasedMusicIds, musicId])]; // Ajoute l'ID de l'album et évite les doublons

        return this.http.patch(`${this.usersUrl}/${userId}`, {
          purchasedMusicIds: updatedPurchases
        });
      }),
      catchError((error) => {
        console.error('Erreur lors de la mise à jour des achats utilisateur', error);
        return of();
      })
    );
  }

  // Génère un ID unique pour chaque achat
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}