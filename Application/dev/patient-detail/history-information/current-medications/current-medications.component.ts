import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-current-medications',
    templateUrl:"app/patient-detail/history-information/current-medications/current-medications.html"
})

export class CurrentMedicationsComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private currentMedicationsForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.currentMedicationsForm = this.fb.group({
				'id':[this.patientHistory.id],
				'patientid':[this.patientHistory.patientid],
				'currentmedications' : [this.patientHistory.currentmedications]
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.currentMedicationsForm.valid && this.currentMedicationsForm.dirty){
			this.patientService.savePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.currentMedicationsForm.markAsPristine();
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