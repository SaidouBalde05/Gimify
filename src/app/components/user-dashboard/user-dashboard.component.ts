import { Component } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { IndexedDbService } from '../../services/IndexedDB.service';
import { Music } from '../../models/music.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  

  userPublications: Music[] = [];
  currentUser: User | null = null;
  constructor(private musicService: MusicService, private authService: AuthService) {}

  ngOnInit(): void {
    //  achat utilisateur
  //  this.authService.currentUser.subscribe(user => {
  //  this.currentUser = user;
  //     if (this.currentUser && this.currentUser.id) {
  //      this.loadUserPublications(this.currentUser.id);
  //     }
  //  });
  // this.authService.currentUser.subscribe(user => {
  //   this.currentUser = user;
  //   if (this.currentUser && this.currentUser.id) {
  //     this.loadUserPublications(this.currentUser.id);
  //   }
  // });
  }
  //  loadUserPublications(userId: number): void {
  //   this.musicService.getUserMusics(userId).subscribe(musics => {
  //    this.userPublications = musics;
  //   });
  // }
  // loadUserPublications(userId: number): void {
  //   this.musicService.getUserPurchases(userId).subscribe(purchases => {
  //     const musicIds = purchases.map(purchase => purchase.musicId);
  //     this.musicService.getMusicsByIds(musicIds).subscribe(musics => {
  //       this.userPublications = musics;
  //     });
  //   });
  // }
  
  
  
  
}
