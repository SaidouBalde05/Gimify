import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicListComponent } from './music-list/music-list.component';
import { MusicDetailComponent } from './music-detail/music-detail.component';
import { PublishMusicComponent } from './publish-music/publish-music.component';

const routes: Routes = [
  { path: '', component: MusicListComponent },
  { path: 'create', component: PublishMusicComponent },
  { path: ':id', component: MusicDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule {}
