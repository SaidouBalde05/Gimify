// debut


import { Component, HostListener, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Music } from '../../models/music.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CinetpayService } from '../../services/cinetpay.service';
import { ChangeDetectorRef } from '@angular/core';
import { PurchaseService } from '../../services/Purchase.service';

@Component({
  selector: 'app-music-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink, 
    FormsModule,
    CurrencyPipe,
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.scss']
})
export class MusicListComponent implements OnInit {
  musics: Music[] = [];
  searchTerm: string = '';
  showPaymentFormFor: string | null = null; // Pour afficher le formulaire de paiement pour un album spécifique
  expandedImageId: string | null = null; // Pour agrandir l'image d'un album
  showMusicList: { [musicId: string]: boolean } = {}; // Pour afficher la liste des musiques d'un album
  selectedMusicId: string | null = null; // Pour l'album actuellement sélectionné pour le paiement
  showPaymentForm: boolean = false;
  purchasedMusicIds: string[] = []; // Pour stocker les albums achetés
  maxImageWidth: number = 800;
  maxImageHeight: number = 800;
  maximizedImageId: string | null = null; // Pour agrandir l'image
  sortBy: 'name' | 'date' = 'date'; 
  public purchaseConfirmed: { [key: string]: boolean } = {}; // Pour confirmer les achats pour chaque album
  isProcessingPurchase: boolean = false; // Pour éviter les achats multiples en même temps

  constructor(
    private authService: AuthService,
    private musicService: MusicService,
    private purchaseService: PurchaseService,
    private cinetpayService: CinetpayService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPurchasedMusicIds();
    this.loadMusics();
  }

  // Charger les albums achetés pour l'utilisateur connecté
  loadPurchasedMusicIds(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.purchaseService.getUserPurchases(currentUser.id).subscribe((ids: string[]) => {
        this.purchasedMusicIds = ids;
        this.purchaseConfirmed = ids.reduce((acc, id) => ({ ...acc, [id]: true }), {});
      });
    }
  }

  // Confirmer l'achat d'un album spécifique
  // onConfirmPurchase(musicId: string | any, musicTitle: string): void { 
  //   if (this.isProcessingPurchase) {
  //     return;
  //   }
  //   this.isProcessingPurchase = true;

  //   // Ajouter l'album acheté pour l'utilisateur actuel
  //   this.authService.addPurchasedMusic(musicId).subscribe(
  //     () => {
  //       this.purchaseConfirmed[musicId] = true; 
  //       this.showPaymentForm = false;
  //       this.selectedMusicId = null;
  //       this.isProcessingPurchase = false;
  //       this.cd.detectChanges(); // Mettre à jour la vue
  //     },
  //     error => {
  //       console.error('Erreur lors de l\'achat de l\'album:', error);
  //       this.isProcessingPurchase = false;
  //     }
  //   );
  // }
  // onConfirmPurchase(musicId: string | any, musicTitle: string): void { 
  //   if (this.isProcessingPurchase) {
  //     return;
  //   }
  //   this.isProcessingPurchase = true;
  
  //   // Ajouter l'album acheté pour l'utilisateur actuel
  //   this.authService.addPurchasedMusic(musicId).subscribe(
  //     () => {
  //       // Après avoir ajouté l'album à l'utilisateur, envoyez l'achat aux ventes
  //       this.authService.sendPurchaseToSales(musicId, musicTitle).subscribe(
  //         () => {
  //           // Mise à jour de l'interface utilisateur après la réussite
  //           this.purchaseConfirmed[musicId] = true; 
  //           this.showPaymentForm = false;
  //           this.selectedMusicId = null;
  //           this.isProcessingPurchase = false;
  //           this.cd.detectChanges(); // Mettre à jour la vue
  //         },
  //         error => {
  //           console.error('Erreur lors de l\'envoi de l\'achat aux ventes:', error);
  //           this.isProcessingPurchase = false;
  //         }
  //       );
  //     },
  //     error => {
  //       console.error('Erreur lors de l\'achat de l\'album:', error);
  //       this.isProcessingPurchase = false;
  //     }
  //   );
  // }

  onConfirmPurchase(musicId: string | any, musicTitle: string): void { 
    if (this.isProcessingPurchase) {
      return;
    }
    this.isProcessingPurchase = true;
    
    console.log(`Attempting to purchase album with ID: ${musicId}`);
  
    // Ajouter l'album acheté pour l'utilisateur actuel
    this.authService.addPurchasedMusic(musicId).subscribe(
      () => {
        console.log(`Album with ID ${musicId} added to purchased list.`);
        // Après avoir ajouté l'album à l'utilisateur, envoyez l'achat aux ventes
        this.authService.sendPurchaseToSales(musicId, musicTitle).subscribe(
          () => {
            console.log(`Purchase for album with ID ${musicId} confirmed and sent to sales.`);
            // Mise à jour de l'interface utilisateur après la réussite
            this.purchaseConfirmed[musicId] = true; 
            this.showPaymentForm = false;
            this.selectedMusicId = null;
            this.isProcessingPurchase = false;
            this.cd.detectChanges(); // Mettre à jour la vue
          },
          error => {
            console.error('Erreur lors de l\'envoi de l\'achat aux ventes:', error);
            this.isProcessingPurchase = false;
          }
        );
      },
      error => {
        console.error('Erreur lors de l\'achat de l\'album:', error);
        this.isProcessingPurchase = false;
      }
    );
  }
  
  

  // Vérifier si un album a déjà été acheté
  isPurchaseConfirmed(musicId: string): boolean { 
    return this.purchaseConfirmed[musicId] || false;
  }

  // Autoriser l'écoute seulement si l'album a été acheté
  canListen(musicId: string): boolean { 
    return this.isPurchaseConfirmed(musicId);
  } 

  // Charger toutes les musiques
  loadMusics(): void {
    this.musicService.getAllMusics().subscribe((musics: Music[]) => {
      this.musics = this.sortMusics(musics, this.sortBy);
    });
  }

  // Trier les musiques 
  sortMusics(musics: Music[], sortBy: 'name' | 'date'): Music[] {
    return musics.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        default:
          return 0;
      }
    });
  }

  // Filtrer les musiques en fonction du terme de recherche
  filterMusics(): Music[] {
    return this.sortMusics(
      this.musics.filter(music =>
        music.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        music.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
      ),
      this.sortBy
    );
  }

  // Vérifier si un album a été acheté
  hasPurchased(musicId: string): boolean { 
    return this.purchasedMusicIds.includes(musicId);
  }

  // Acheter un album spécifique
  // onBuyMusic(musicId: string | null, musicTitle: string, price: number): void {
  //   if (musicId === null) {
  //     console.error('Music ID is undefined');
  //     return;
  //   }

  //   if (this.showPaymentForm && this.selectedMusicId === musicId) {
  //     return;
  //   }
    
  //   this.showPaymentForm = true;
  //   this.selectedMusicId = musicId;
  
  //   // Créer un objet de paiement pour Cinetpay
  //   const customerData = {
  //     customer_name: "John",
  //     customer_surname: "Down",
  //     customer_email: "down@test.com",
  //     customer_phone_number: "088767611",
  //     customer_address: "BP 0024",
  //     customer_city: "Antananarivo",
  //     customer_country: "CM",
  //     customer_state: "CM",
  //     customer_zip_code: "06510"
  //   };
  
  //   // Appeler le service de paiement pour déclencher le paiement
  //   this.cinetpayService.checkout(price, `Paiement pour l'album ${musicTitle}`);
  // }
  onBuyMusic(musicId: string | null, musicTitle: string, price: number): void {
    if (musicId === null) {
      console.error('Music ID is undefined');
      return;
    }
  
    if (this.showPaymentForm && this.selectedMusicId === musicId) {
      return;
    }
    
    console.log(`Preparing to buy music with ID: ${musicId}`);
  
    this.showPaymentForm = true;
    this.selectedMusicId = musicId;
    
    // Créer un objet de paiement pour Cinetpay
    const customerData = {
      customer_name: "John",
      customer_surname: "Down",
      customer_email: "down@test.com",
      customer_phone_number: "088767611",
      customer_address: "BP 0024",
      customer_city: "Antananarivo",
      customer_country: "CM",
      customer_state: "CM",
      customer_zip_code: "06510"
    };
  
    // Appeler le service de paiement pour déclencher le paiement
    this.cinetpayService.checkout(price, `Paiement pour l'album ${musicTitle}`);
  }
  

  // Basculer l'affichage de la liste des musiques pour un album spécifique
  toggleMusicList(musicId: string): void {
    if (!musicId) {
      console.error('Music ID is undefined');
      return;
    }
    this.showMusicList[musicId] = !this.showMusicList[musicId];
  }

  // Vérifier si la liste des musiques d'un album est visible
  isMusicListVisible(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return !!this.showMusicList[musicId];
  }

  // Basculer la taille de l'image d'un album (agrandir/réduire)
  toggleImageSize(musicId: string): void {
    if (!musicId) {
      console.error('Music ID is undefined');
      return;
    }
  
    if (this.expandedImageId === musicId) {
      this.maximizedImageId = this.maximizedImageId === musicId ? null : musicId;
    } else {
      this.expandedImageId = musicId;
      this.maximizedImageId = null;
    }
  }

  // Vérifier si l'image d'un album est agrandie
  isImageExpanded(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return this.expandedImageId === musicId;
  }

  // Vérifier si l'image d'un album est maximisée
  isImageMaximized(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return this.maximizedImageId === musicId;
  }

  // Télécharger l'image d'un album
  downloadImage(imageUrl: string, imageTitle: string): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageTitle;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Fermer l'image agrandie si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const imageElement = document.getElementById(`image-${this.expandedImageId}`);

    if (imageElement && !imageElement.contains(target)) {
      this.expandedImageId = null;
      this.maximizedImageId = null;
    }
  }

  // Traitement du paiement pour un album spécifique
  processPayment(musicId: string | null): void { 
    if (musicId === null) {
      console.error('Music ID is undefined');
      return;
    }
    console.log(`Music with ID ${musicId} purchased`);
  }

  // Alerter l'utilisateur de télécharger l'application pour écouter de la musique
  onListen(): void {
    alert("Pour écouter cet album, veuillez télécharger notre application.");
  }
  
}



// fin


// import { Component, HostListener, OnInit } from '@angular/core';
// import { MusicService } from '../../services/music.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule, CurrencyPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
// import { Music } from '../../models/music.model';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CinetpayService } from '../../services/cinetpay.service';
// import { ChangeDetectorRef } from '@angular/core';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-music-list',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     CommonModule,
//     RouterLink, 
//     FormsModule,
//     CurrencyPipe,
//     UpperCasePipe,
//     TitleCasePipe
//   ],
//   templateUrl: './music-list.component.html',
//   styleUrls: ['./music-list.component.scss']
// })
// export class MusicListComponent implements OnInit {
//   musics: Music[] = [];
//   searchTerm: string = '';
//   showPaymentFormFor: string | null = null; // Changez ici pour `string`
//   expandedImageId: string | null = null; // Changez ici pour `string`
//   showMusicList: { [musicId: string]: boolean } = {}; // Changez ici pour `string`
//   selectedMusicId: string | null = null; // Changez ici pour `string`
//   showPaymentForm: boolean = false;
//   purchasedMusicIds: string[] = []; // Changez ici pour `string`
//   maxImageWidth: number = 800;
//   maxImageHeight: number = 800;
//   maximizedImageId: string | null = null; // Changez ici pour `string`
//   sortBy: 'name' | 'date' = 'date'; 
//   public purchaseConfirmed: { [key: string]: boolean } = {}; // Changez ici pour `string`
//   isProcessingPurchase: boolean = false;

//   constructor(
//     private authService: AuthService,
//     private musicService: MusicService,
//     private purchaseService: PurchaseService,
//     private cinetpayService: CinetpayService,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadPurchasedMusicIds();
//     this.loadMusics();
//   }
//   loadPurchasedMusicIds(): void {
//     const currentUser = this.authService.getCurrentUser();
//     if (currentUser) {
//       this.purchaseService.getUserPurchases(currentUser.id).subscribe((ids: string[]) => {
//         // Charger uniquement les albums achetés pour l'utilisateur
//         this.purchasedMusicIds = ids;
//         this.purchaseConfirmed = ids.reduce((acc, id) => ({ ...acc, [id]: true }), {});
//       });
//     }
//   }
  

 
//   onConfirmPurchase(musicId: string | any, musicTitle: string): void { 
//     if (this.isProcessingPurchase) {
//       return;
//     }
//     this.isProcessingPurchase = true;
  
//     // Ajout seulement pour cet album
//     this.authService.addPurchasedMusic(musicId).subscribe(
//       () => {
//         // Mettre à jour uniquement cet album dans purchaseConfirmed
//         this.purchaseConfirmed[musicId] = true; 
//         this.showPaymentForm = false;
//         this.selectedMusicId = null;
//         this.cd.detectChanges(); // Mettre à jour la vue
//         this.isProcessingPurchase = false;
//       },
//       error => {
//         console.error('Erreur lors de l\'ajout de l\'album acheté:', error);
//         this.isProcessingPurchase = false;
//       }
//     );
//   }
  

//   isPurchaseConfirmed(musicId: string): boolean { // Changez ici pour `string`
//     return this.purchaseConfirmed[musicId] || false;
//   }

//   canListen(musicId: string): boolean { // Changez ici pour `string`
//     return this.isPurchaseConfirmed(musicId);
//   } 

//   loadMusics(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.musics = this.sortMusics(musics, this.sortBy);
//     });
//   }

//   sortMusics(musics: Music[], sortBy: 'name' | 'date'): Music[] {
//     return musics.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.title.localeCompare(b.title);
//         case 'date':
//           return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
//         default:
//           return 0;
//       }
//     });
//   }

//   filterMusics(): Music[] {
//     return this.sortMusics(
//       this.musics.filter(music =>
//         music.title.toLowerCase().includes(this.searchTerm.toLowerCase() || '') ||
//         music.artist.toLowerCase().includes(this.searchTerm.toLowerCase() || '')
//       ),
//       this.sortBy
//     );
//   }

//   hasPurchased(musicId: string): boolean { // Changez ici pour `string`
//     return this.purchasedMusicIds.includes(musicId);
//   }

//   onBuyMusic(musicId: string | null, musicTitle: string, price: number): void {
//     if (musicId === null) {
//       console.error('Music ID is undefined');
//       return;
//     }
  
//     if (this.showPaymentForm && this.selectedMusicId === musicId) {
//       return;
//     }
    
//     this.showPaymentForm = true;
//     this.selectedMusicId = musicId;
  
//     // Créer un objet de paiement pour Cinetpay
//     const customerData = {
//       customer_name: "John",
//       customer_surname: "Down",
//       customer_email: "down@test.com",
//       customer_phone_number: "088767611",
//       customer_address: "BP 0024",
//       customer_city: "Antananarivo",
//       customer_country: "CM",
//       customer_state: "CM",
//       customer_zip_code: "06510"
//     };
  
//     // Appeler le service de paiement pour déclencher le paiement
//     this.cinetpayService.checkout(price, `Paiement pour l'album ${musicTitle}`)
      
//   }
  
  
  

//   toggleMusicList(musicId: string): void {
//     // Vérifiez que musicId n'est pas null
//     if (!musicId) {
//       console.error('Music ID is undefined');
//       return;
//     }
//     this.showMusicList[musicId] = !this.showMusicList[musicId];
//   }

//   isMusicListVisible(musicId: string | null): boolean { // Changez ici pour `string`
//     if (musicId === null) {
//       return false;
//     }
//     return !!this.showMusicList[musicId];
//   }


//   toggleImageSize(musicId: string): void {
//     if (!musicId) {
//       console.error('Music ID is undefined');
//       return;
//     }
  
//     if (this.expandedImageId === musicId) {
//       this.maximizedImageId = this.maximizedImageId === musicId ? null : musicId;
//     } else {
//       this.expandedImageId = musicId;
//       this.maximizedImageId = null;
//     }
//   }

//   isImageExpanded(musicId: string | null): boolean { // Changez ici pour `string`
//     if (musicId === null) {
//       return false;
//     }
//     return this.expandedImageId === musicId;
//   }

//   isImageMaximized(musicId: string | null): boolean { // Changez ici pour `string`
//     if (musicId === null) {
//       return false;
//     }
//     return this.maximizedImageId === musicId;
//   }

//   downloadImage(imageUrl: string, imageTitle: string): void {
//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = imageTitle;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent): void {
//     const target = event.target as HTMLElement;
//     const imageElement = document.getElementById(`image-${this.expandedImageId}`);

//     if (imageElement && !imageElement.contains(target)) {
//       this.expandedImageId = null;
//       this.maximizedImageId = null;
//     }
//   }

//   processPayment(musicId: string | null): void { // Changez ici pour `string`
//     if (musicId === null) {
//       console.error('Music ID is undefined');
//       return;
//     }
//     console.log(`Music with ID ${musicId} purchased`);
//   }

//   onListen(): void {
//     alert('Pour écouter l\'album, téléchargez notre application.');
//   }

//   onSortChange(sortBy: 'name' | 'date'): void {
//     this.sortBy = sortBy;
//     this.loadMusics(); // Recharger les musiques après avoir changé le critère
//   }
// }





// import { Component, HostListener, OnInit } from '@angular/core';
// import { MusicService } from '../../services/music.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule, CurrencyPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
// import { Music } from '../../models/music.model';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CinetpayService } from '../../services/cinetpay.service';
// import { ChangeDetectorRef } from '@angular/core';
// import { PurchaseService } from '../../services/Purchase.service';

// @Component({
//   selector: 'app-music-list',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     CommonModule,
//     RouterLink, 
//     FormsModule,
//     CurrencyPipe,
//     UpperCasePipe,
//     TitleCasePipe
//   ],
//   templateUrl: './music-list.component.html',
//   styleUrls: ['./music-list.component.scss']
// })
// export class MusicListComponent implements OnInit {
//   musics: Music[] = [];
//   searchTerm: string = '';
//   showPaymentFormFor: number | null = null;
//   expandedImageId: number | null = null;
//   showMusicList: { [musicId: number]: boolean } = {};
//   selectedMusicId: number | null = null;
//   showPaymentForm: boolean = false;
//   purchasedMusicIds: number[] = [];
//   maxImageWidth: number = 800;
//   maxImageHeight: number = 800;
//   maximizedImageId: number | null = null;
//   sortBy: 'name' | 'date' = 'date'; 
//   public purchaseConfirmed: { [key: number]: boolean } = {};

//   constructor(
//     private authService: AuthService,
//     private musicService: MusicService,
//     private purchaseService: PurchaseService,
//     private cinetpayService: CinetpayService,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadPurchasedMusicIds();
//     this.loadMusics();
//   }

//   // Charger les albums achetés depuis le serveur
//   loadPurchasedMusicIds(): void {
//     const currentUser = this.authService.getCurrentUser();
//     if (currentUser) {
//       this.purchaseService.getPurchasesForUser(currentUser.id).subscribe((ids: number[]) => {
//         this.purchasedMusicIds = ids;
//         this.purchaseConfirmed = ids.reduce((acc, id) => ({ ...acc, [id]: true }), {});
//       });
//     }
//   }

//   // Méthode pour confirmer l'achat
//   onConfirmPurchase(musicId: number, musicTitle: string): void {
//     this.authService.addPurchasedMusic(musicId).subscribe(
//       () => {
//         this.purchaseConfirmed[musicId] = true;
//         this.showPaymentForm = false;
//         this.selectedMusicId = null;
//         this.cd.detectChanges(); // Mise à jour de la vue
//       },
//       error => {
//         console.error('Erreur lors de l\'ajout de l\'album acheté:', error);
//       }
//     );
//   }

//   // Méthode pour vérifier si un achat est confirmé
//   isPurchaseConfirmed(musicId: number): boolean {
//     return this.purchaseConfirmed[musicId] || false;
//   }

//   // Méthode pour vérifier si l'utilisateur peut écouter la musique
//   canListen(musicId: number): boolean {
//     return this.isPurchaseConfirmed(musicId);
//   } 

//   // Charger les musiques et trier en fonction du critère
//   loadMusics(): void {
//     this.musicService.getAllMusics().subscribe((musics: Music[]) => {
//       this.musics = this.sortMusics(musics, this.sortBy);
//     });
//   }

//   // Fonction pour trier les musiques
//   sortMusics(musics: Music[], sortBy: 'name' | 'date' ): Music[] {
//     return musics.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.title.localeCompare(b.title);
//         case 'date':
//           return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
//         default:
//           return 0;
//       }
//     });
//   }

//   // Méthode pour filtrer les musiques
//   // filterMusics(): Music[] {
//   //   return this.sortMusics(
//   //     this.musics.filter(music =>
//   //       music.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//   //       music.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
//   //     ),
//   //     this.sortBy
//   //   );
//   // }
//   filterMusics(): Music[] {
//     return this.sortMusics(
//       this.musics.filter(music => 
//         (music.title?.toLowerCase().includes(this.searchTerm?.toLowerCase() || '') || 
//          music.artist?.toLowerCase().includes(this.searchTerm?.toLowerCase() || ''))
//       ),
//       this.sortBy
//     );
//   }


//   hasPurchased(musicId: number): boolean {
//     return this.purchasedMusicIds.includes(musicId);
//   }

//   onBuyMusic(musicId: number | null, musicTitle: string, price: number): void {
//     if (musicId === null) {
//       console.error('Music ID is undefined');
//       return;
//     }

//     this.showPaymentForm = true;
//     this.selectedMusicId = musicId;

//     const customerData = {
//       customer_name: "John",
//       customer_surname: "Down",
//       customer_email: "down@test.com",
//       customer_phone_number: "088767611",
//       customer_address: "BP 0024",
//       customer_city: "Antananarivo",
//       customer_country: "CM",
//       customer_state: "CM",
//       customer_zip_code: "06510"
//     };

//     this.cinetpayService.checkout(price, `Paiement pour l'album ${musicTitle}`);
//   }

//   toggleMusicList(musicId: number | null): void {
//     if (musicId === null) {
//       return;
//     }
//     this.showMusicList[musicId] = !this.showMusicList[musicId];
//   }

//   isMusicListVisible(musicId: number | null): boolean {
//     if (musicId === null) {
//       return false;
//     }
//     return !!this.showMusicList[musicId];
//   }

//   toggleImageSize(musicId: number | null): void {
//     if (musicId === null) {
//       return;
//     }

//     if (this.expandedImageId === musicId) {
//       if (this.maximizedImageId === musicId) {
//         this.maximizedImageId = null;
//       } else {
//         this.maximizedImageId = musicId;
//       }
//     } else {
//       this.expandedImageId = musicId;
//       this.maximizedImageId = null;
//     }
//   }

//   isImageExpanded(musicId: number | null): boolean {
//     if (musicId === null) {
//       return false;
//     }
//     return this.expandedImageId === musicId;
//   }

//   isImageMaximized(musicId: number | null): boolean {
//     if (musicId === null) {
//       return false;
//     }
//     return this.maximizedImageId === musicId;
//   }

//   downloadImage(imageUrl: string, imageTitle: string): void {
//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = imageTitle;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent): void {
//     const target = event.target as HTMLElement;
//     const imageElement = document.getElementById(`image-${this.expandedImageId}`);

//     if (imageElement && !imageElement.contains(target)) {
//       this.expandedImageId = null;
//       this.maximizedImageId = null;
//     }
//   }

//   processPayment(musicId: number | null): void {
//     if (musicId === null) {
//       console.error('Music ID is undefined');
//       return;
//     }
//     console.log(`Music with ID ${musicId} purchased`);
//   }

//   onListen(): void {
//     alert('Pour écouter l\'album, téléchargez notre application.');
//   }

//   // Méthode pour changer le critère de tri
//   onSortChange(sortBy: 'name' | 'date'): void {
//     this.sortBy = sortBy;
//     this.loadMusics(); // Recharger les musiques après avoir changé le critère
//   }
// }