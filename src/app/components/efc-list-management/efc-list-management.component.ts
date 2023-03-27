import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { EfcListManagementService } from 'src/app/service/efc-list-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-efc-list-management',
  templateUrl: './efc-list-management.component.html',
  styleUrls: ['./efc-list-management.component.css']
})
export class EfcListManagementComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['efcCode', 'serviceProvider', 'flagActive', 'action'];
  public dataSource = new MatTableDataSource<any>();
  public search: FormGroup;
  public complete = true;
  public operations: Operation[] = [];
  private subscription: Subscription[] = [];
  constructor(
    private permissionService: PagePermissionService,
    private efcListService: EfcListManagementService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: ['']
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  public callGetAPI(): void {
    this.complete = false;
    const efcCode = this.search.get('ctrlSearch')?.value;
    console.log(efcCode);
    this.subscription.push(this.efcListService.getEfcList(efcCode).subscribe({
      next: efc => {
        this.dataSource.data = efc;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public activate(efcCode: String): void {
    const title = this.translate.instant('manage_efc.activateTitle');
    const content = this.translate.instant('manage_efc.activateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.efcListService.activateEfc(efcCode).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  public deactivate(efcCode: String): void {
    const title = this.translate.instant('manage_efc.disactivateTitle');
    const content = this.translate.instant('manage_efc.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.efcListService.deactivateEfc(efcCode).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }


  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      permission => this.operations = permission.operations
    ));
  }

}
