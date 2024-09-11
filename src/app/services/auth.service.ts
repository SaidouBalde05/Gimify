import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private contactUrl = 'http://localhost:3000/contact';
  private salesUrl = 'http://localhost:3000/sales'; // Ajoutez cette ligne pour les ventes
  private _currentUser: any = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      this.currentUserSubject.next(JSON.parse(userFromStorage));
    }
  }
  // debut essaie

  sendPurchaseToSales(musicId: number, musicTitle: string): Observable<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const saleData = {
      musicId: musicId.toString(),
      musicTitle,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      date: new Date().toISOString()
      
    };

    return this.http.post<void>(this.salesUrl, saleData).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'envoi de l\'achat:', error);
        throw new Error('Unable to send purchase to sales');
      })
    );
  }

  // Ajoutez cette méthode à votre processus d'achat
  addPurchasedMusicAndSendToSales(musicId: number, musicTitle: string): Observable<any> {
    return this.addPurchasedMusic(musicId).pipe(
      map(() => {
        // Une fois l'achat ajouté à l'utilisateur, envoyez-le à l'API de ventes
        return this.sendPurchaseToSales(musicId, musicTitle).subscribe();
      })
    );
  }

  // fin essaie

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/users/${user.id}`, user);
  }
  

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
        this.http.get<User>(`${this.apiUrl}/${user.id}`).subscribe(fetchedUser => {
            this.currentUserSubject.next(fetchedUser);
            localStorage.setItem('currentUser', JSON.stringify(fetchedUser));
        });
    } else {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
    }
}


  getContactMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.contactUrl);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
        map(users => {
            if (users.length > 0) {
                const user = users[0];
                // Comparer le mot de passe haché
                if (bcrypt.compareSync(password, user.password)) {
                    this.setCurrentUser(user);
                    return true;
                }
            }
            return false;
        }),
        catchError(() => {
            return [false];
        })
    );
}


  logout(): void {
    this.setCurrentUser(null);
    this._currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  register( id: any, firstName: string, lastName: string, username: string, password: string, role: 'admin' | 'user'): Observable<void> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user: User = {
        firstName,
        lastName,
        username,
        password: hashedPassword,
        role,
        id,
        purchasedMusicIds: [] // Ajoutez cette ligne pour initialiser la liste des albums achetés
    };

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


  getUserPurchasedMusicIds(userId: number): Observable<number[]> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      map(user => user.purchasedMusicIds || []),
      catchError(error => {
        console.error('Erreur lors de la récupération des albums achetés:', error);
        return [];
      })
    );
  }
  
  
  addPurchasedMusic(musicId: number): Observable<void> {
    const user = this.getCurrentUser();
  
    if (user) {
      // Ajoutez l'album à la liste des albums achetés
      user.purchasedMusicIds = user.purchasedMusicIds || [];
      user.purchasedMusicIds.push(musicId);
  
      // Mettez à jour l'utilisateur sur le serveur
      return this.http.put<void>(`${this.apiUrl}/${user.id}`, user).pipe(
        map(() => {
          // Mettez à jour l'utilisateur dans le service
          this.setCurrentUser(user);
        }),
        catchError(error => {
          console.error('Erreur lors de la mise à jour des albums achetés:', error);
          throw new Error('Unable to update purchased albums');
        })
      );
    } else {
      throw new Error('User is not logged in');
    }
  }
   

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.role === 'admin' : false;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl); 
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  addUser(userData: User): Observable<User> {
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);

    return this.http.post<User>(this.apiUrl, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}

