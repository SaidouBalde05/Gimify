// import { Routes } from '@angular/router';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { MusicListComponent } from './components/music-module/music-list/music-list.component';
// import { PublishMusicComponent } from './components/music-module/publish-music/publish-music.component';
// import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
// import { LoginComponent } from './components/auth-module/login/login.component';
// import { RegisterComponent } from './components/auth-module/register/register.component';
// import { MusicDetailComponent } from './components/music-module/music-detail/music-detail.component';
// import { AuthGuard } from './services/auth.guard';
// import { ConditionItulisationComponent } from './components/condition-itulisation/condition-itulisation.component';
// import { RemboursementComponent } from './components/remboursement/remboursement.component';
// import { ConfidentialiteComponent } from './components/confidentialite/confidentialite.component';
// import { HeaderComponent } from './components/header/header.component';
// import { ContactFormComponent } from './components/contact-form/contact-form.component';
// export const routes: Routes = [
//     { path: '', component: MusicListComponent },  // Redirection pour les routes non trouvées
//     {path: 'contact', component: ContactFormComponent},
//     {path:'music', component: MusicListComponent},
//     {path:'publier', component: PublishMusicComponent},
//     {path: 'register', component: RegisterComponent},
//     { path: 'music/:id', component: MusicDetailComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
//     { path: 'user-dashboard', component: UserDashboardComponent, },
//     {path: 'condition', component: ConditionItulisationComponent},
//     {path: 'remboursement', component: RemboursementComponent},
//     {path: 'confidentialite', component: ConfidentialiteComponent},
//     {path: 'header', component: HeaderComponent},
//     { path: '**', redirectTo: '' },
// ];


import { Routes } from '@angular/router';
import { ConditionItulisationComponent } from './components/condition-itulisation/condition-itulisation.component';
import { ConfidentialiteComponent } from './components/confidentialite/confidentialite.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { HeaderComponent } from './components/header/header.component';
import { RemboursementComponent } from './components/remboursement/remboursement.component';

export const routes: Routes = [  
  {
    path: 'music',
    loadChildren: () =>
      import('./components/music-module/music-module.module').then(m => m.MusicModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'user-dashboard',
    loadChildren: () =>
      import('./components/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/auth-module/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./components/auth-module/register/register.module').then(m => m.RegisterModule)
  },
  {
    path:'publish',
    loadChildren: () => 
      import('./components/music-module/publish-music/publish.module').then(m => m.PublishModule)
  },
  {path: 'contact', component: ContactFormComponent},
  {path: 'condition', component: ConditionItulisationComponent},
  {path: 'remboursement', component: RemboursementComponent},
  {path: 'confidentialite', component: ConfidentialiteComponent},
  {path: 'header', component: HeaderComponent},
  {
    path: '',
    redirectTo: 'music', 
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'music' 
  }
]
