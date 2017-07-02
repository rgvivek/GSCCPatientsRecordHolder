import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-obstetric-history',
    templateUrl:"app/patient-detail/history-information/obstetric-history/obstetric-history.html"
})

export class ObstetricHistoryComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private obstetricHistoryForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.obstetricHistoryForm = this.fb.group({
				'patienthistoryid':[this.patientHistory.id],
				'labourhistory' : [this.patientHistory.labourhistory]
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.obstetricHistoryForm.valid && this.obstetricHistoryForm.dirty){
			this.patientService.saveFemalePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.obstetricHistoryForm.markAsPristine();
			  				break;
			  			}
			  			case 1:{
			  				this.status = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  {
			  		this.status = 'error';
			  		this.errorMessage = <any>error;
			  	}
			);
		}
	}
}