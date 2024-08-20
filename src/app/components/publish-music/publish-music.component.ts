import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { FormBuilder, FormGroup, FormsModule, NgControl, NgControlStatusGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicationService } from '../../services/publication.service';
import { CommonModule } from '@angular/common';
import { IndexedDbService } from '../../services/IndexedDB.service';
import { Music } from '../../models/music.model';


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
    audioFiles: [] as { name: string; content: string }[]
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
    // const newPublication = {
    //   title: this.newMusic.title,
    //   description: this.newMusic.description,
    //   imageUrl: this.newMusic.imageUrl,
    //   audioFiles: this.newMusic.audioFiles.map(file => file.name),
    //   artist: this.newMusic.artist,
    //   sales: 0 // Initialise les ventes à 0
    // };

    const newPublication: Music = {
      title: this.newMusic.title,
      description: this.newMusic.description,
      imageUrl: this.newMusic.imageUrl,
      audioFiles: this.newMusic.audioFiles.map(file => file.name),
      artist: this.newMusic.artist
    };
    this.musicService.publishMusic(newPublication).subscribe(() => {
      console.log('Publication ajoutée avec succès');
      this.newMusic = {
        title: '',
        artist: '',
        description: '',
        imageUrl: '',
        audioFiles: []
      };
    }, error => {
      console.error('Erreur lors de l\'ajout de la publication', error);
    });
  }

  reloadMusicList(): void {
    // Cette méthode peut émettre un événement pour recharger la liste des musiques ou appeler une fonction du parent
    this.musicService.getAllMusics().subscribe(musics => {
      // Mettez à jour la liste des musiques dans votre composant
    });
  }

  // newMusic = {
  //   title: '',
  //   artist: '',
  //   description: '',
  //   imageUrl: '',
  //   audioFiles: [] as { name: string; content: string }[] // Modification ici
  // };

  // constructor(private indexedDbService: IndexedDbService) {}

  // onFileSelected(event: any, fileType: string): void {
  //   const files = event.target.files;

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       if (fileType === 'image') {
  //         this.newMusic.imageUrl = reader.result as string;
  //       } else if (fileType === 'audio') {
  //         const originalName = file.name;
  //         this.newMusic.audioFiles.push({
  //           name: originalName, // Le nom par défaut est le nom original du fichier
  //           content: reader.result as string
  //         });
  //       }
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // }

  // onAudioNameChange(index: number, newName: string): void {
  //   this.newMusic.audioFiles[index].name = newName || this.newMusic.audioFiles[index].name;
  // }

  // onSubmit(): void {
  //   const newPublication = {
  //     title: this.newMusic.title,
  //     description: this.newMusic.description,
  //     imageUrl: this.newMusic.imageUrl,
  //     audioFiles: this.newMusic.audioFiles.map(file => file.name),
  //     artist: this.newMusic.artist
  //   };

  //   this.indexedDbService.addPublication(newPublication).then(() => {
  //     console.log('Publication ajoutée avec succès');
  //     this.newMusic = {
  //       title: '',
  //       artist: '',
  //       description: '',
  //       imageUrl: '',
  //       audioFiles: []
  //     };
  //   });
  // }
}
