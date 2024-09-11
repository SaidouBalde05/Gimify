import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MusicService } from '../../services/music.service';
import { User } from '../../models/user.model';
import { Music } from '../../models/music.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/Purchase.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  purchases: Music[] = [];
  showUserInfo: boolean = false;

  constructor(
    public authService: AuthService,
    private musicService: MusicService,
    private router: Router,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadUserPurchases(user.id);
      }
    });
  }

  loadUserPurchases(userId: string): void {
    this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
      this.purchases = []; // Réinitialisation des achats

      if (purchasedMusicIds.length) {
        purchasedMusicIds.forEach((musicId: string | any) => {
          this.musicService.getMusicById(musicId).subscribe(music => {
            this.purchases.push(music);
          });
        });
      }
    });
  }

  deletePurchase(musicId: string): void {
    if (this.currentUser) {
      const userId = this.currentUser.id;
  
      this.purchaseService.deletePurchase(userId, musicId).subscribe(() => {
        // Recharger les achats après suppression pour refléter les changements
        this.loadUserPurchases(userId);
      });
    }
  }
  
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/music']);
  }

  toggleUserInfo(): void {
    this.showUserInfo = !this.showUserInfo;
  }
} 



// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { MusicService } from '../../services/music.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   purchases: Music[] = [];
//   showUserInfo: boolean = false;

//   constructor(
//     public authService: AuthService,
//     private musicService: MusicService,
//     private router: Router,
//     private purchaseService: PurchaseService
//   ) {}

//   ngOnInit(): void {
//     this.authService.currentUser.subscribe(user => {
//       if (user) {
//         this.currentUser = user;
//         this.loadUserPurchases(user.id);
//       }
//     });
//   }

//   loadUserPurchases(userId: string): void {
//     this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
//       this.purchases = []; // Réinitialisation des achats

//       if (purchasedMusicIds.length) {
//         purchasedMusicIds.forEach((musicId: string | any) => {
//           this.musicService.getMusicById(musicId).subscribe(music => {
//             this.purchases.push(music);
//           });
//         });
//       }
//     });
//   }

//   // deletePurchase(musicId: string): void {
//   //   if (this.currentUser) {
//   //     const userId = this.currentUser.id;

//   //     this.purchaseService.deletePurchase(userId, musicId).subscribe(() => {
//   //       this.loadUserPurchases(userId); // Recharger les achats pour s'assurer que la suppression est bien reflétée
//   //     });
//   //   }
//   // }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/music']);
//   }

//   toggleUserInfo(): void {
//     this.showUserInfo = !this.showUserInfo;
//   }
// }






// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { MusicService } from '../../services/music.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { Router } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   purchases: Music[] = [];
//   showUserInfo: boolean = false;

//   constructor(
//     public authService: AuthService,
//     private musicService: MusicService,
//     private router: Router,
//     private purchaseService: PurchaseService
//   ) {}

//   ngOnInit(): void {
//     this.authService.currentUser.subscribe(user => {
//       if (user) {
//         this.currentUser = user;
//         this.loadUserPurchases(user.id);
//       }
//     });
//   }

 
//   loadUserPurchases(userId: string): void {
//     this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
//       this.purchases = []; // Réinitialisation des achats
  
//       purchasedMusicIds.forEach((musicId: string | any) => {
//         this.musicService.getMusicById(musicId).subscribe(music => {
//           this.purchases.push(music);
//         });
//       });
//     });
//   }
  

//   deletePurchase(musicId: string): void { // Changez ici pour `string`
//     if (this.currentUser) {
//       const userId = this.currentUser.id;

//       this.purchaseService.deletePurchase(userId, musicId).subscribe(() => {
//         this.purchases = this.purchases.filter(p => p.id !== musicId);
//       });
//     }
//   }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/music']);
//   }

//   toggleUserInfo(): void {
//     this.showUserInfo = !this.showUserInfo;
//   }
// }






// // user-dashboard.component.ts

// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { MusicService } from '../../services/music.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { Router } from '@angular/router';
// // import { PurchaseService } from '../../services/purchase.service';
// import { HttpClientModule } from '@angular/common/http';
// import { PurchaseService } from '../../services/Purchase.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   purchases: Music[] = [];
//   showUserInfo: boolean = false;

//   constructor(
//     public authService: AuthService,
//     private musicService: MusicService,
//     private router: Router,
//     private purchaseService: PurchaseService
//   ) {}

//   ngOnInit(): void {
//     this.authService.currentUser.subscribe(user => {
//       if (user) {
//         this.currentUser = user;
//         this.loadUserPurchases(user.id);
//       }
//     });
//   }

//   loadUserPurchases(userId: string): void {
//     this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
//       this.purchases = []; // Réinitialise les achats

//       purchasedMusicIds.forEach(musicId => {
//         this.musicService.getMusicById(musicId).subscribe(music => {
//           this.purchases.push(music);
//         });
//       });
//     });
//   }

//   deletePurchase(musicId: any): void {
//     if (this.currentUser) {
//       const userId = this.currentUser.id;

//       // Appelle la méthode du service pour supprimer l'achat sur le serveur
//       this.purchaseService.deletePurchase(userId, musicId).subscribe(() => {
//         // Mise à jour locale après suppression sur le serveur
//         this.purchases = this.purchases.filter(p => p.id !== musicId);
//       });
//     }
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/music']);
//   }

//   toggleUserInfo() {
//     this.showUserInfo = !this.showUserInfo;
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { MusicService } from '../../services/music.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     HttpClientModule
//   ],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   purchasedMusics: Music[] = [];
//   purchases: any[] = [];
//   showUserInfo: boolean = false; 

//   constructor(
//     public authService: AuthService,
//     private musicService: MusicService,
//     private router: Router,
//     private purchaseService: PurchaseService
//   ) {}

//   ngOnInit(): void {
//     this.loadUserInfo();
//     this.authService.currentUser.subscribe(user => {
//       if (user) {
//         this.currentUser = user;
//         this.loadUserPurchases(user.id);
//       }
//     });
//   }
  
//   loadUserPurchases(userId: string): void {
//     this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
//       this.purchases = [];

//       purchasedMusicIds.forEach(musicId => {
//         this.musicService.getMusicById(musicId).subscribe(music => {
//           this.purchases.push(music);
//         });
//       });
//     });
//   }
  
//   loadUserInfo(): void {
//     this.currentUser = this.authService.getCurrentUser();
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/music']);
//   }

//   toggleUserInfo() {
//     this.showUserInfo = !this.showUserInfo;
//   }

//   // Nouvelle méthode pour supprimer un achat
//   deletePurchase(purchaseId: number): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cet achat ?')) {
//       this.purchaseService.deletePurchase(purchaseId).subscribe(() => {
//         // Met à jour la liste des achats après suppression
//         this.purchases = this.purchases.filter(purchase => purchase.id !== purchaseId);
//         console.log('Achat supprimé avec succès');
//       }, error => {
//         console.error('Erreur lors de la suppression de l\'achat', error);
//       });
//     }
//   }
// }
 




// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { MusicService } from '../../services/music.service';
// import { User } from '../../models/user.model';
// import { Music } from '../../models/music.model';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     HttpClientModule
//   ],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   purchasedMusics: Music[] = [];
//   purchases: any[] = [];
//   showUserInfo: boolean = false; 

//   constructor(
//     public authService: AuthService,
//     private musicService: MusicService,
//     private router: Router,
//     private purchaseService: PurchaseService
//   ) {}

//   ngOnInit(): void {
//     this.loadUserInfo()
//     this.authService.currentUser.subscribe(user => {
//       if (user) {
//         this.currentUser = user;
//         this.loadUserPurchases(user.id);
//       }
//     });
//   }
  
//   loadUserPurchases(userId: string): void {
//     this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
//       this.purchases = [];

//       purchasedMusicIds.forEach(musicId => {
//         this.musicService.getMusicById(musicId).subscribe(music => {
//           this.purchases.push(music);
//         });
//       });
//     });
//   }
  
//   loadUserInfo(): void {
//     this.currentUser = this.authService.getCurrentUser();
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/music']);
//   }

//   toggleUserInfo() {
//     this.showUserInfo = !this.showUserInfo;
//   }
// }