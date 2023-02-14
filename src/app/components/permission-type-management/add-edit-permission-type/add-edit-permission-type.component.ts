import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-permission-type',
  templateUrl: './add-edit-permission-type.component.html',
  styles: [
  ]
})
export class AddEditPermissionTypeComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlName: ['', Validators.required]
    });
  }

}
