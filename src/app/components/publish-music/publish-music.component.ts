import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { FormBuilder, FormGroup, FormsModule, NgControl, NgControlStatusGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicationService } from '../../services/publication.service';
import { CommonModule } from '@angular/common';
import { IndexedDbService } from '../../services/IndexedDB.service';
import { Music } from '../../models/music.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-publish-music',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './publish-music.component.html',
  styleUrl: './publish-music.component.scss'
})
export class PublishMusicComponent {

  newMusic = {
    title: '',
    artist: '',
    description: '',
    imageUrl: '',
    audioFiles: [] as { name: string; content: string }[],
    price: 0 ,// Initialisation du prix
    personalRevenue: 0 // Initialisation du revenu personnel
  };

  constructor(private musicService: MusicService) {}

  onFileSelected(event: any, fileType: string): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        if (fileType === 'image') {
          this.newMusic.imageUrl = reader.result as string;
        } else if (fileType === 'audio') {
          const originalName = file.name;
          this.newMusic.audioFiles.push({
            name: originalName,
            content: reader.result as string
          });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  onAudioNameChange(index: number, newName: string): void {
    this.newMusic.audioFiles[index].name = newName || this.newMusic.audioFiles[index].name;
  }

  onSubmit(): void {
    const newPublication: Music = {
      id: uuidv4(), // Génère un identifiant unique
      title: this.newMusic.title,
      description: this.newMusic.description,
      imageUrl: this.newMusic.imageUrl,
      audioFiles: this.newMusic.audioFiles.map(file => file.name),
      artist: this.newMusic.artist,
      price: this.newMusic.price,
      personalRevenue: this.newMusic.personalRevenue, // Envoi du revenu personnel par vente
      totalPersonalRevenue: 0, // Initialisation à 0
      releaseDate: new Date()
    };
  
    this.musicService.publishMusic(newPublication).subscribe(() => {
      console.log('Publication ajoutée avec succès');
      this.resetForm();
    }, error => {
      console.error('Erreur lors de l\'ajout de la publication', error);
    });
  }

  resetForm(): void {
    this.newMusic = {
      title: '',
      artist: '',
      description: '',
      imageUrl: '',
      audioFiles: [],
      price: 0 ,// Réinitialisation du prix
      personalRevenue: 0
    };
  }

  reloadMusicList(): void {
    this.musicService.getAllMusics().subscribe(musics => {
      // Mise à jour de la liste des musiques après le rechargement
    });
  }
}
