// music.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Music } from '../models/music.model';

export interface Sale {
  id: number; 
  musicId: string | null;
  musicTitle: string;
  date: string;
  price: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = 'http://localhost:3000/musics'; 
  private salesUrl = 'http://localhost:3000/sales'; 

  constructor(private http: HttpClient) {

  }

   // Méthode pour réinitialiser toutes les ventes
   resetSales(): Observable<void> {
    return this.getSales().pipe(
      switchMap(sales => {
        const deleteRequests = sales.map(sale => 
          this.http.delete<void>(`${this.salesUrl}/${sale.id}`, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          })
        );
        return forkJoin(deleteRequests).pipe(map(() => {}));
      })
    );
  }
  // Méthode pour réinitialiser les ventes d'un album spécifique
  resetSalesForAlbum(musicId: number): Observable<any> {
    return new Observable((observer) => {
      this.http.get<any[]>(this.salesUrl).subscribe(
        (sales) => {
          const salesToDelete = sales.filter((sale) => sale.musicId === musicId);

          if (salesToDelete.length === 0) {
            observer.complete(); 
            return;
          }

          const deleteRequests = salesToDelete.map((sale) =>
            this.http.delete(`${this.salesUrl}/${sale.id}`)
          );

          forkJoin(deleteRequests).subscribe(
            () => {
              observer.next(); // Succès
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }




     // Récupérer toutes les musiques
  getMusics(): Observable<Music[]> {
    return this.http.get<Music[]>(this.apiUrl);
  }


  // Calculer le revenu personnel total
  getTotalPersonalRevenue(): Observable<number> {
    return this.getMusics().pipe(
      map((musics: Music[]) => musics.reduce((acc, music) => acc + (music.personalRevenue || 0), 0))
    );
  }
  purchaseMusic(musicId: number, userId: number): Observable<any> {
    return this.getMusicById(musicId).pipe(
      switchMap((music: Music) => {
        const saleData = {
          musicId: music.id,
          musicTitle: music.title,
          price: music.price,
          userId: userId,
          date: new Date().toISOString()
        };

        return this.recordSale(saleData).pipe(
          switchMap(() => {
            const updatedPersonalRevenue = (music.personalRevenue || 0) + music.price;
            return this.updateMusic(musicId, { 
              personalRevenue: updatedPersonalRevenue
            });
          })
        );
      })
    );
  }

// debut 
// Calculer le revenu personnel d'un artiste
getArtistRevenue(artistName: string): Observable<number> {
  return this.getMusics().pipe(
    map((musics: Music[]) => 
      musics
        .filter(music => music.artist === artistName)  // Filtrer les musiques de l'artiste
        .reduce((acc, music) => acc + (music.personalRevenue || 0), 0) // Additionner les revenus
    )
  );
}

// fin 

  // Supprimer une musique
  deleteMusic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // Récupérer toutes les ventes
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.salesUrl);
  }


  // Générer un nouvel ID incrémental pour les ventes
  private generateNextSaleId(): Observable<number> {
    return this.getSales().pipe(
      map(sales => {
        const maxId = sales.reduce((max, sale) => sale.id > max ? sale.id : max, 0);
        return maxId + 1;
      })
    );
  }

  // Enregistrer une vente avec un ID incrémenté
  recordSale(saleData: any): Observable<any> {
    return this.generateNextSaleId().pipe(
      switchMap(nextId => {
        const saleWithId = { ...saleData, id: nextId }; // Ajouter l'ID incrémenté à la vente
        return this.http.post(this.salesUrl, saleWithId, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        });
      })
    );
  }

  // Récupérer toutes les musiques
  getAllMusics(): Observable<Music[]> {
    return this.http.get<Music[]>(this.apiUrl);
  }

  // Récupérer les achats d'un utilisateur
  getUserPurchases(userId: number): Observable<Music[]> {
    return this.http.get<any[]>(`${this.salesUrl}?userId=${userId}`).pipe(
      switchMap(sales => {
        const musicIds = sales.map(sale => sale.musicId);
        const musicRequests = musicIds.map(id => this.http.get<Music>(`${this.apiUrl}/${id}`));
        return forkJoin(musicRequests);
      })
    );
  }

  // Publier une musique
  publishMusic(musicData: Music): Observable<Music> {
    console.log('Données envoyées au serveur:', musicData);
    return this.http.post<Music>(this.apiUrl, musicData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Récupérer une musique par son ID
  getMusicById(id: number): Observable<Music> {
    return this.http.get<Music>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour les ventes d'une musique
  updateMusicSales(musicId: number, sales: number): Observable<Music> {
    return this.http.patch<Music>(`${this.apiUrl}/${musicId}`, { sales });
  }

  // Mettre à jour une musique
  updateMusic(id: number, musicData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, musicData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Mettre à jour le nombre de ventes
  updateSalesCount(musicId: number, count: number): Observable<Music> {
    return this.http.patch<Music>(`${this.apiUrl}/${musicId}`, { salesCount: count }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Récupérer les ventes hebdomadaires
  getWeeklySales(): Observable<{ week: string, sales: number }[]> {
    return this.http.get<Sale[]>(this.salesUrl)
      .pipe(
        map(sales => {
          const salesByWeek = sales.reduce((acc, sale) => {
            const saleDate = new Date(sale.date);
            const startOfWeek = new Date(saleDate.setDate(saleDate.getDate() - saleDate.getDay()));
            const weekString = `${startOfWeek.getFullYear()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`;

            if (!acc[weekString]) {
              acc[weekString] = 0;
            }
            acc[weekString]++;
            return acc;
          }, {} as { [key: string]: number });

          return Object.keys(salesByWeek).map(week => ({
            week,
            sales: salesByWeek[week]
          }));
        })
      );
  }

  // Calculer le revenu personnel total pour tous les albums
  getPersonalRevenueTotal(): Observable<number> {
    return this.getMusics().pipe(
      map(musics => musics.reduce((acc, music) => acc + (music.personalRevenue || 0), 0))
    );
  }
}