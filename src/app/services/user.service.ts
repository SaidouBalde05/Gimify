import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3000/users'; // URL de l'API pour les utilisateurs

  constructor(private http: HttpClient) {}

  // Récupérer un utilisateur par son ID
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`);
  }

  // Mettre à jour un utilisateur
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.usersUrl}/${user.id}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl);
  }

  // Ajouter un nouvel utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${userId}`);
  }
}
