import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/autentication/login/login.component';
import { TemplateComponent } from './template/template.component';
import { SendMailComponent } from './components/autentication/send-mail/send-mail.component';
import { ResetPasswordComponent } from './components/autentication/reset-password/reset-password.component';
import { AuthGuard } from './core/guards';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'send-mail', component: SendMailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '', component: TemplateComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () => import("src/app/components/user-management/user-management.module").then(m => m.UserManagementModule),
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
