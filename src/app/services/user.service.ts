import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.usersUrl}/${user.id}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${userId}`);
  }
    
}
