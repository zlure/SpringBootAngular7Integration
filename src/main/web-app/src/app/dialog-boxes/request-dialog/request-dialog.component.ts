import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { MatInput, MatCheckbox, MatFormField } from '@angular/material';
import { RequestService } from '../../services/request.service';
import { RequestData } from '../../models/request-data';


@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent implements OnInit {

  form: FormGroup;
  myEmpId: number;    
  defaultReasons = [];


  constructor(
    private dialogRef: MatDialogRef<RequestDialogComponent>,
    private fb: FormBuilder,
    public requestService: RequestService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.myEmpId = data.empId;
   }

  ngOnInit() {
    this.requestService.getReasons().subscribe(res => {  
        this.defaultReasons = res;
        const reasonControls = this.defaultReasons.map(c => new FormControl(false));
        this.form = this.fb.group({
          'reasons': new FormArray(reasonControls),
          'otherReason': new FormControl(''),
          'comment': new FormControl('', [Validators.required])
        });        
    });

  }

  onSubmit(): void {
    // generate explanation
    const explanation = this.form.get('comment').value + this.form.get('otherReason').value;
    // get selected reason IDs from checkboxes
    const selectedReasonIds = this.form.value.reasons
      .map((v, i) => v ? this.defaultReasons[i].id : null)
      .filter(v => v !== null);

    this.requestService.addRequest(this.myEmpId, explanation, selectedReasonIds).subscribe();
  }

}