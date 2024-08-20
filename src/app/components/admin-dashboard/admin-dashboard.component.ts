import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Music } from '../../models/music.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{

  isAdmin: boolean = false;
  users: User[] = [];
  totalUsers: number = 0;
  allPublications: Music[] = [];
  musicSales: { music: Music, sales: number }[] = [];

  constructor(private musicService: MusicService,private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      // Rediriger vers une autre page si l'utilisateur n'est pas un administrateur
      return;
    }
    // Charger la liste des utilisateurs
    this.loadUsers();
    this.loadAllPublications();
    this.loadMusicSales();
  }

  // loadAllPublications(): void {
  //   this.musicService.getAllMusics().subscribe((musics: Music[]) => {
  //     this.allPublications = musics;
  //   });
  // }

  loadAllPublications(): void {
    this.musicService.getAllMusics().subscribe((musics: Music[]) => {
      this.allPublications = musics;
      this.loadMusicSales(); // Charger les ventes après avoir obtenu toutes les publications
    });
  }

  loadMusicSales(): void {
    this.musicService.getAllSales().subscribe(sales => {
      // Comptabiliser les ventes par musique
      const salesCount = sales.reduce((acc: { [key: number]: number }, sale: any) => {
        acc[sale.musicId] = (acc[sale.musicId] || 0) + 1;
        return acc;
      }, {});

      // Associer les ventes aux musiques
      this.musicSales = this.allPublications.map(music => ({
        music,
        sales: salesCount[music.id!] || 0
      }));
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
      this.totalUsers = users.length;
    });
  }

  deleteUser(userId: number | undefined): void {
    if (userId !== undefined) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        this.authService.deleteUser(userId).subscribe(() => {
          this.loadUsers(); // Recharger la liste des utilisateurs après suppression
        });
      }
    } else {
      alert('ID utilisateur non défini');
    }
  }

}
