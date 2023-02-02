import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LibTemplateComponent } from 'dema-movyon-template';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
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
      },
      {
        path: 'parking-management',
        loadChildren: () => import("src/app/components/park-management/park-management.module").then(m => m.ParkManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'gate-management',
        loadChildren: () => import("src/app/components/gate-management/gate-management.module").then(m => m.GateManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'permission-management',
        loadChildren: () => import("src/app/components/permission-management/permission.module").then(m => m.PermissionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'transit-management',
        loadChildren: () => import("src/app/components/transit-management/transit-management.module").then(m => m.TransitManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'permission-type-management',
        loadChildren:
          () => import("src/app/components/permission-type-management/permission-type-management.module").then(m => m.PermissionTypeManagementModule),
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
