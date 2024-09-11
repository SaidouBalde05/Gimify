import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MusicListComponent } from '../music-list/music-list.component';
import { PublishMusicComponent } from '../publish-music/publish-music.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MusicListComponent,
    PublishMusicComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  menuVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

    ngOnInit(): void {}

    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }
  
    isAdmin(): boolean {
      return this.authService.isAdmin();
    }
  
    navigateToUserDashboard(): void {
      this.router.navigate(['/user-dashboard']);
    }
  
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      const menuElement = document.querySelector('.menu-container');
      
      if (this.menuVisible && menuElement && !menuElement.contains(target)) {
        this.menuVisible = false;
      }
    }

}
