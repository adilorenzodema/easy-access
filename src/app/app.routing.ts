import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LibLoginComponent, LibResetPasswordComponent, LibSendMailComponent, LibTemplateComponent } from 'dema-movyon-template';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: LibLoginComponent },
  { path: 'send-mail', component: LibSendMailComponent },
  { path: 'reset-password', component: LibResetPasswordComponent },
  {
    path: '', component: LibTemplateComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () => import("dema-users-management").then(m => m.DemaUsersManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'area-management',
        loadChildren: () => import("src/app/components/area-management/area-management.module").then(m => m.AreaManagementModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
