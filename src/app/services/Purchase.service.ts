import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchasedMusicIds: Set<string> = new Set<string>();
  private apiUrl = 'http://localhost:3000/sales';
  private usersUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient  ) {}

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
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      switchMap(user => {
        const updatedPurchasedMusicIds = user.purchasedMusicIds.filter((id: string) => id !== musicId);
        
        const updatedUser = { ...user, purchasedMusicIds: updatedPurchasedMusicIds };
  
        return this.http.put(`${this.usersUrl}/${userId}`, updatedUser);
      })
    );
  }

  purchaseMusic(purchase: { musicId: string; musicTitle: string; date: string }): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  isPurchased(musicId: string): boolean {
    return this.purchasedMusicIds.has(musicId);
  }

  public updateUserPurchases(userId: string, musicId: string, remove: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      switchMap(user => {
        const updatedPurchases = remove
          ? user.purchasedMusicIds.filter((id: string) => id !== musicId) 
          : [...new Set([...user.purchasedMusicIds, musicId])]; 

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


}