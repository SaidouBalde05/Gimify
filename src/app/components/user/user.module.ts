import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: UserDashboardComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserModule { }

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UserRoutingModule } from './user-routing.module';
// import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

// @NgModule({
//   declarations: [
//   ],
//   imports: [
//     CommonModule,
//     UserRoutingModule
//   ]
// })
// export class UserModule {}
