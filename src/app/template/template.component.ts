import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ResetPasswordComponent } from '../components/autentication/reset-password/reset-password.component';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookiService: CookieService,
    private dialog: MatDialog) { }

  logout(): void {
    this.authService.logout().subscribe({
      next: (resp) => console.log(resp),
      complete: () => {
        this.cookiService.deleteAll();
        this.router.navigate(['/login']);
      }
    });
  }

  changePassword(): void {
    this.dialog.open(ResetPasswordComponent, { width: '50%', height: '60%', data: { isChange: true } });
  }
}
