import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../services/music.service';

@Component({
  selector: 'app-music-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './music-detail.component.html',
  styleUrls: ['./music-detail.component.scss']
})
export class MusicDetailComponent implements OnInit {

  music: any;
  showPaymentForm: boolean = false;
  showListenMessage: boolean = false;
  isPurchased: boolean = false;
  detailsVisible: boolean = false; // Ajout d'une propriété pour contrôler l'affichage

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    const musicId = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(musicId);

    if (!isNaN(parsedId)) {
      this.musicService.getMusicById(parsedId).subscribe(
        music => {
          this.music = music;
        },
        error => {
          console.error('Error fetching music:', error);
        }
      );
    } else {
      console.error('Music ID is not a valid number');
    }
  }

  showDetails(): void {
    this.detailsVisible = !this.detailsVisible; // Basculer l'affichage des détails
  }

  processPayment(): void {
    this.isPurchased = true;
    this.showPaymentForm = false;
  }

  showListenMessages(): void {
    alert('Pour écouter l\'album, téléchargez notre application.');
  }
}