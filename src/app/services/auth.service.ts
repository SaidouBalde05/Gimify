import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:3000/users';
  // private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
   private _currentUser: any = null; // Utilisez un underscore pour indiquer qu'il s'agit d'une propriété privée
  // public currentUser: Observable<User | null > = this.currentUserSubject.asObservable();
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();
  // private currentUserSubject = new BehaviorSubject<User | null>(null);
  // private currentUser: any = null;
  // Assurez-vous que getUserMusics() renvoie les musiques achetées par l'utilisateur
  // getUserMusics(userId: number): Observable<any[]> {
  // return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  // }


 isLoggedIn(): boolean {
    return !!this._currentUser;
   }

  constructor(private http: HttpClient) {
    // Charger les informations de l'utilisateur actuel depuis le stockage local lors de l'initialisation
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      this.currentUserSubject.next(JSON.parse(userFromStorage));
    }
  }

  // debut
   // Méthodes pour gérer les utilisateurs et les sessions
   public setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }
  // fin

   // Cette méthode charge l'utilisateur actuel depuis le localStorage
   private loadUserFromLocalStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Méthode pour obtenir l'utilisateur actuel
  // getCurrentUser() {
  //   return this.currentUser;
  // }

  // // Méthode pour enregistrer l'utilisateur actuel dans le localStorage
  // setCurrentUser(user: any) {
  //   this.currentUser = user;
  //   localStorage.setItem('currentUser', JSON.stringify(user));
  // }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        // Vérifier si l'utilisateur est l'administrateur
        if (username === 'balde@gmail.com' && password === 'doss1310') {
          const adminUser: User = { username, password, role: 'admin' };
          this.currentUserSubject.next(adminUser);
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          return true;
        }
        
        // Vérifier les autres utilisateurs dans la base de données JSON
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        }
        return false;
      }),
      catchError(() => {
        return [false];
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  register(username: string, password: string, role: 'admin' | 'user'): Observable<void> {
    const user = { username, password, role };
    console.log('Tentative d\'enregistrement de l\'utilisateur:', user);

    return this.http.post<void>(this.apiUrl, user).pipe(
      map(response => {
          console.log('Enregistrement réussi:', response);
          return response;
      }),
      catchError((error) => {
          console.error('Erreur lors de l\'enregistrement:', error);
          throw new Error('Unable to register user');
      })
  );
}
  

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.role === 'admin' : false;
  }

   // Obtenir la liste des utilisateurs
   getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Supprimer un utilisateur par ID
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}


