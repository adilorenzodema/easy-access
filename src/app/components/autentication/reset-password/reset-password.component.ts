import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [`
  .login-card {
    border-radius: 10px;
    width: 50%;
  }
  `
  ]
})
export class ResetPasswordComponent implements OnInit {
  public formGroup!: FormGroup;
  private token!: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isChange: boolean }) { }

  ngOnInit(): void {
    console.log(this.data);
    if (!this.data.isChange) {
      this.formGroup = this.formBuilder.group({
        ctrlNewPassword: ['', [Validators.required, Validators.minLength(8)]],
        ctrlConfirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlNewPassword: ['', [Validators.required, Validators.minLength(8)]],
        ctrlConfirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        ctrlOldPassword: ['', [Validators.required, Validators.minLength(8)]],
      });
    }
    this.route.queryParams.subscribe(
      params => this.token = params['token']
    );
  }

  public savePassword(): void {
    console.log(this.token);
    const password = this.formGroup.get('ctrlNewPassword')?.value;
    const confirmPassword = this.formGroup.get('ctrlConfirmPassword')?.value;
    if (password !== confirmPassword) {
      this.snackBar.open('Password inserite non sono uguali', "X", {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'ERROR'
      });
    } else if (this.data.isChange) {
      const oldPassword = this.formGroup.get('ctrlOldPassword')?.value;
      this.authService.changePassword( password, oldPassword).subscribe({
        next: () => this.snackBar.open('Password modificata', "X", {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'INFO'
        }),
        error: () => {
          this.snackBar.open("Errore!", "X", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'ERROR'
          });
        },
        complete: () => this.dialogRef.close(true)
      });
    } else {
      this.authService.resetPassword(this.token, password).subscribe(
        () => this.snackBar.open('Password modificata', "X", {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'INFO'
        })
      );
    }
  }
  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
