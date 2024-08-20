import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MusicListComponent } from './components/music-list/music-list.component';
import { PublishMusicComponent } from './components/publish-music/publish-music.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MusicDetailComponent } from './components/music-detail/music-detail.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    // { path: '', redirectTo: '/utulisateur', pathMatch: 'full' },
    {path:'music', component: MusicListComponent},
    {path:'publier', component: PublishMusicComponent},
    {path: 'register', component: RegisterComponent},
    { path: 'music/:id', component: MusicDetailComponent },
    { path: '', component: MusicListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'user-dashboard', component: UserDashboardComponent, },
    { path: '**', redirectTo: '' }  // Redirection pour les routes non trouvées
];
