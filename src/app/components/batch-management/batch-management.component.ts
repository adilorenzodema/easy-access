import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subscription, switchMap, timer } from 'rxjs';
import { Job } from 'src/app/domain/interface';
import { BatchManagementService } from 'src/app/service/batch-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-batch-management',
  templateUrl: './batch-management.component.html',
  styleUrls: ['./batch-management.component.css']
})
export class BatchManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['jobName', 'jobDescription', 'chronExpression', 'chronDescription', 'nextRunDate', 'scheduled', 'action'];
  public complete = true;
  private subscription: Subscription[] = [];
  private interval: Subscription;
  public search: FormGroup;
  public dataSource = new MatTableDataSource<Job>();
  public active: FormGroup;

  constructor(
    public translate: TranslateService,
    private batchManagementService: BatchManagementService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.interval = interval(60000).subscribe(
      () => this.callGetAPI()
      );
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.interval.unsubscribe();
  }

  public callGetAPI(): void {
    this.complete = false;
    this.subscription.push(this.batchManagementService.getAllJobs().subscribe({
      next: jobs => {
        this.dataSource.data = jobs;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public disableJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.activateTitle');
    const content = this.translate.instant('manage_batches.activateConfirm');
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
          this.subscription.push(this.batchManagementService.disableJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  public enableJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.disactivateTitle');
    const content = this.translate.instant('manage_batches.disactivateConfirm');
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
          this.subscription.push(this.batchManagementService.enableJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  public runJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.executeJobTitle');
    const content = this.translate.instant('manage_batches.executeJobConfirm');
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
          this.subscription.push(this.batchManagementService.runJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }



}
