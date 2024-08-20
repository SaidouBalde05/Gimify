import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MusicListComponent } from './components/music-list/music-list.component';
import { PublishMusicComponent } from './components/publish-music/publish-music.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MusicListComponent,
    PublishMusicComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'doss';

  menuVisible = false;

  constructor(private authService: AuthService,
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

  //   ngOnInit(): void {
  
  //   }

  // toggleMenu() {
  //   this.menuVisible = !this.menuVisible;
  // }

  // isAdmin(): boolean {
  //   return this.authService.isAdmin();
  // }

  // navigateToUserDashboard(): void {
  //    this.router.navigate(['/user-dashboard']);
  // }

}
