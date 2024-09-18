import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MusicService } from '../../../services/music.service';
import { User } from '../../../models/user.model';
import { Music } from '../../../models/music.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseService } from '../../../services/Purchase.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  purchases: Music[] = [];
  showUserInfo: boolean = false;
  
  fullText: string = '';
  animatedText: string = '';
  letterIndex: number = 0;

  constructor(
    public authService: AuthService,
    private musicService: MusicService,
    private router: Router,
    private purchaseService: PurchaseService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.fullText = `Bienvenue, ${user.firstName} ${user.lastName}`;
        this.animateText(); 
        this.loadUserPurchases(user.id);
      }
    });
  }

  animateText(): void {
    const interval = 200;
    const textLength = this.fullText.length;

    const textInterval = setInterval(() => {
      if (this.letterIndex < textLength) {
        this.animatedText += this.fullText[this.letterIndex];
        this.letterIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, interval);
  }

  loadUserPurchases(userId: string): void {
    this.purchaseService.getUserPurchases(userId).subscribe(purchasedMusicIds => {
      this.purchases = []; 

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
      
      const confirmDelete = window.confirm('Voulez-vous vraiment supprimer cet album ?');
  
      if (confirmDelete) {
        this.purchaseService.deletePurchase(userId, musicId).subscribe(
          () => {
            this.loadUserPurchases(userId); 
  
            alert('L\'achat a été supprimé avec succès.');
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'achat:', error);
            alert('Une erreur est survenue lors de la suppression de l\'achat.');
          }
        );
      }
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