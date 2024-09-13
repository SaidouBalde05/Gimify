import { Component, HostListener, OnInit } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Music } from '../../../models/music.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CinetpayService } from '../../../services/cinetpay.service';
import { ChangeDetectorRef } from '@angular/core';
import { PurchaseService } from '../../../services/Purchase.service';

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
  showPaymentFormFor: string | null = null; 
  expandedImageId: string | null = null; 
  showMusicList: { [musicId: string]: boolean } = {}; 
  selectedMusicId: string | null = null; 
  showPaymentForm: boolean = false;
  purchasedMusicIds: string[] = []; 
  maxImageWidth: number = 800;
  maxImageHeight: number = 800;
  maximizedImageId: string | null = null; 
  sortBy: 'name' | 'date' = 'date'; 
  public purchaseConfirmed: { [key: string]: boolean } = {}; 
  isProcessingPurchase: boolean = false; 

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

  loadPurchasedMusicIds(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.purchaseService.getUserPurchases(currentUser.id).subscribe((ids: string[]) => {
        this.purchasedMusicIds = ids;
        this.purchaseConfirmed = ids.reduce((acc, id) => ({ ...acc, [id]: true }), {});
      });
    }
  }

  onConfirmPurchase(musicId: string | any, musicTitle: string): void { 
    if (this.isProcessingPurchase) {
      return;
    }
    this.isProcessingPurchase = true;
    
    console.log(`Attempting to purchase album with ID: ${musicId}`);
  
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.purchaseService.updateUserPurchases(currentUser.id, musicId).subscribe(
        () => {
          console.log(`Album with ID ${musicId} added to purchased list.`);
          this.purchaseService.purchaseMusic({ musicId, musicTitle, date: new Date().toISOString() }).subscribe(
            () => {
              console.log(`Purchase for album with ID ${musicId} confirmed and sent to sales.`);
              this.purchaseConfirmed[musicId] = true; 
              this.showPaymentForm = false;
              this.selectedMusicId = null;
              this.isProcessingPurchase = false;
              this.cd.detectChanges(); 
            },
            error => {
              console.error('Erreur lors de l\'envoi de l\'achat aux ventes:', error);
              this.isProcessingPurchase = false;
            }
          );
        },
        error => {
          console.error('Erreur lors de l\'ajout de l\'album aux achats:', error);
          this.isProcessingPurchase = false;
        }
      );
    } else {
      console.error('Utilisateur non connecté');
      this.isProcessingPurchase = false;
    }
  }  

  isPurchaseConfirmed(musicId: string): boolean { 
    return this.purchaseConfirmed[musicId] || false;
  }

  canListen(musicId: string): boolean { 
    return this.isPurchaseConfirmed(musicId);
  } 

  loadMusics(): void {
    this.musicService.getAllMusics().subscribe((musics: Music[]) => {
      this.musics = this.sortMusics(musics, this.sortBy);
    });
  }

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

  filterMusics(): Music[] {
    return this.sortMusics(
      this.musics.filter(music =>
        music.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        music.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
      ),
      this.sortBy
    );
  }

  hasPurchased(musicId: string): boolean { 
    return this.purchasedMusicIds.includes(musicId);
  }

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
  
    this.cinetpayService.checkout(price, `Paiement pour l'album ${musicTitle}`);
  }
  
  

  toggleMusicList(musicId: string): void {
    if (!musicId) {
      console.error('Music ID is undefined');
      return;
    }
    this.showMusicList[musicId] = !this.showMusicList[musicId];
  }

  isMusicListVisible(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return !!this.showMusicList[musicId];
  }

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

  isImageExpanded(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return this.expandedImageId === musicId;
  }

  isImageMaximized(musicId: string | null): boolean { 
    if (musicId === null) {
      return false;
    }
    return this.maximizedImageId === musicId;
  }

  downloadImage(imageUrl: string, imageTitle: string): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageTitle;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const imageElement = document.getElementById(`image-${this.expandedImageId}`);

    if (imageElement && !imageElement.contains(target)) {
      this.expandedImageId = null;
      this.maximizedImageId = null;
    }
  }

  processPayment(musicId: string | null): void { 
    if (musicId === null) {
      console.error('Music ID is undefined');
      return;
    }
    console.log(`Music with ID ${musicId} purchased`);
  }

  onListen(): void {
    alert("Pour écouter cet album, veuillez télécharger notre application.");
  }
  
}