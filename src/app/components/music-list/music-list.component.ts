import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Publication, PublicationService } from '../../services/publication.service';
import { IndexedDbService } from '../../services/IndexedDB.service';
import { Music } from '../../models/music.model';
import { Router, RouterLink } from '@angular/router';
import { PurchaseService } from '../../services/Purchase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-music-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './music-list.component.html',
  styleUrl: './music-list.component.scss'
})
export class MusicListComponent implements OnInit {

  musics: any[] = [];
  showPaymentFormFor: number | null = null;
  // showMusicListId: number | null = null;
  expandedImageId: number | null = null; // Ajout pour suivre l'image agrandie
  showMusicList: { [musicId: number]: boolean } = {}; // Ajout pour suivre l'état d'affichage des musiques
  selectedMusicId: number | null = null;
  showPaymentForm: boolean = false;
  purchasedMusicId: number | null = null; 
  purchasedMusicIds: number[] = [];  // Remplacez ici


  // Variables pour le formulaire de paiement
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  constructor(
    private musicService: MusicService,
    private purchaseService: PurchaseService,
    private authService: AuthService
  ) {}

  // ngOnInit(): void {
  //   this.musicService.getMusics().subscribe((musics) => {
  //     this.musics = musics;
  //   });
  // }

  ngOnInit(): void {
     this.musicService.getMusics().subscribe((data) => {
      this.musics = data;
      
    });
  }

  hasPurchased(musicId: number): boolean {
    return this.purchasedMusicIds.includes(musicId);
  }

  loadMusics(): void {
    this.musicService.getAllMusics().subscribe((musics: Music[]) => {
      this.musics = musics;
    });
  }

  
 


  checkPurchasedMusics(): void {
    this.musicService.getSales().subscribe((sales) => {
      this.purchasedMusicIds = sales.map(sale => sale.musicId);
    });
  }


  onBuyMusic(musicId: number, musicTitle: string): void {
    this.showPaymentForm = true;
    this.selectedMusicId = musicId;
  }

  onConfirmPurchase(musicId: number, musicTitle: string): void {
    const saleData = {
      musicId: musicId,
      musicTitle: musicTitle,
      date: new Date(),
    };

    this.musicService.recordSale(saleData).subscribe(() => {
      console.log('Achat enregistré avec succès.');
      this.purchasedMusicId = musicId;
      this.showPaymentForm = false; // Masquer le formulaire de paiement après achat
    });
  }

  canListen(musicId: number): boolean {
    return this.purchasedMusicId === musicId;
  }

  onListenMusic(): void {
    alert("Pour écouter l'album, téléchargez notre application.");
  }


  toggleMusicList(musicId: number) {
    this.showMusicList[musicId] = !this.showMusicList[musicId];
  }

  isMusicListVisible(musicId: number): boolean {
    return !!this.showMusicList[musicId];
  }

  toggleImageSize(musicId: number) {
    if (this.expandedImageId === musicId) {
      this.expandedImageId = null; // Collapse if already expanded
    } else {
      this.expandedImageId = musicId; // Expand the clicked image
    }
  }

  isImageExpanded(musicId: number): boolean {
    return this.expandedImageId === musicId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const imageElement = document.getElementById(`image-${this.expandedImageId}`);

    if (imageElement && !imageElement.contains(target)) {
      this.expandedImageId = null; // Collapse image if clicked outside
    }
  }

  processPayment(musicId: number): void {
    // Logique pour traiter le paiement
    this.purchaseService.purchaseMusic(musicId);
    console.log(`Music with ID ${musicId} purchased`);
    
    // Réinitialiser le formulaire de paiement après achat
    this.showPaymentFormFor = null;
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
  }

  isPurchased(musicId: number): boolean {
    return this.purchaseService.isPurchased(musicId);
  }

  onListen(): void {
    alert('Pour écouter l\'album, téléchargez notre application.');
  }
}
