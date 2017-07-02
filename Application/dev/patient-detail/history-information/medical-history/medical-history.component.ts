import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-medical-history',
    templateUrl:"app/patient-detail/history-information/medical-history/medical-history.html"
})

export class MedicalHistoryComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private medicalHistoryForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.medicalHistoryForm = this.fb.group({
				'id':[this.patientHistory.id],
				'patientid':[this.patientHistory.patientid],
				'pastmedicalhistory' : [this.patientHistory.pastmedicalhistory]
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.medicalHistoryForm.valid && this.medicalHistoryForm.dirty){
			this.patientService.savePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.medicalHistoryForm.markAsPristine();
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