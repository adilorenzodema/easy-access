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
        path: 'park-management',
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
        path: 'permission-interporto-management',
        loadChildren: () => import("src/app/components/permission-interporto-management/permission-interporto.module").then(m => m.PermissionInterportoModule),
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
      {
        path: 'incidents-management',
        loadChildren:
          () => import("src/app/components/incidents-management/incidents-management.module").then(m => m.IncidentsManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'batch-management',
        loadChildren:
          () => import("src/app/components/batch-management/batch-management.module").then(m => m.BatchManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'select-holidays',
        loadChildren:
          () => import("src/app/components/holidays-component/holidays-component.module").then(m => m.HolidaysComponentModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'efc-list-management',
        loadChildren:
          () => import("src/app/components/efc-list-management/efc-list-management.module").then(m => m.EfcListManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'logs',
        loadChildren:
          () => import("src/app/components/logs-component/logs.module").then(m => m.LogsModule),
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
