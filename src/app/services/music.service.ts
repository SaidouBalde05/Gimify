import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Music } from '../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private apiUrl = 'http://localhost:3000/musics';
  private salesUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) {}

 

  // Méthode pour enregistrer une vente (acheter une musique)
  purchaseMusic(musicId: number, userId: number): Observable<any> {
    const saleData = { musicId, userId };
    return this.http.post(`${this.apiUrl}/sales`, saleData);
  }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.salesUrl}/sales`);
  }

   // Méthode pour récupérer les musiques
   getMusics(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Méthode pour enregistrer une vente
  recordSale(saleData: any): Observable<any> {
    return this.http.post(this.salesUrl, saleData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAllMusics(): Observable<Music[]> {
    return this.http.get<Music[]>(this.apiUrl);
  }

  getAllSales(): Observable<any[]> {
    return this.http.get<any[]>(this.salesUrl);
  }

  // Méthode pour obtenir les musiques achetées par un utilisateur
  getUserMusics(userId: number): Observable<Music[]> {
    return this.http.get<Music[]>(`${this.salesUrl}/${userId}`);
  }
    
  publishMusic(musicData: Music): Observable<Music> {
    return this.http.post<Music>(this.apiUrl, musicData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getMusicById(id: number): Observable<Music> {
    return this.http.get<Music>(`${this.apiUrl}/${id}`);
  }

  updateMusicSales(musicId: number, sales: number): Observable<Music> {
    return this.http.patch<Music>(`${this.apiUrl}/${musicId}`, { sales });
  }
  
  updateMusic(id: number, musicData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, musicData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  

  // Mettre à jour le nombre de ventes d'une musique
  updateSalesCount(musicId: number, count: number): Observable<Music> {
    return this.http.patch<Music>(`${this.apiUrl}/${musicId}`, { salesCount: count }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}