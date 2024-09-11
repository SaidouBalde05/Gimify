import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MusicListComponent } from './components/music-list/music-list.component';
import { PublishMusicComponent } from './components/publish-music/publish-music.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MusicDetailComponent } from './components/music-detail/music-detail.component';
import { AuthGuard } from './services/auth.guard';
import { ConditionItulisationComponent } from './components/condition-itulisation/condition-itulisation.component';
import { RemboursementComponent } from './components/remboursement/remboursement.component';
import { ConfidentialiteComponent } from './components/confidentialite/confidentialite.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

export const routes: Routes = [
    { path: '', component: MusicListComponent },  // Redirection pour les routes non trouvées
    {path: 'contact', component: ContactFormComponent},
    {path:'music', component: MusicListComponent},
    {path:'publier', component: PublishMusicComponent},
    {path: 'register', component: RegisterComponent},
    { path: 'music/:id', component: MusicDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'user-dashboard', component: UserDashboardComponent, },
    {path: 'condition', component: ConditionItulisationComponent},
    {path: 'remboursement', component: RemboursementComponent},
    {path: 'confidentialite', component: ConfidentialiteComponent},
    {path: 'header', component: HeaderComponent},
    { path: '**', redirectTo: '' },
];
