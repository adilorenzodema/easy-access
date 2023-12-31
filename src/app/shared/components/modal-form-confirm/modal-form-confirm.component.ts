import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-user',
  templateUrl: './modal-form-confirm.component.html',
  styleUrls: ['./modal-form-confirm.component.css']
})
export class ModalFormConfirmComponent {
  subscription: Subscription[] = [];
  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ModalFormConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }
  ) { }

}



