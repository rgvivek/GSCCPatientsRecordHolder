import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-history-of-illness',
    templateUrl:"app/patient-detail/history-information/history-of-illness/history-of-illness.html"
})

export class HistoryOfIllnessComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private historyOfIllnessForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.historyOfIllnessForm = this.fb.group({
				'id':[this.patientHistory.id],
				'patientid':[this.patientHistory.patientid],
				'ishypertensive' : [this.patientHistory.ishypertensive, Validators.required],
			    'isdiabetic' : [this.patientHistory.isdiabetic, Validators.required],
			    'otherillness' : [this.patientHistory.otherillness]
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.historyOfIllnessForm.valid && this.historyOfIllnessForm.dirty){
			this.patientService.savePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.historyOfIllnessForm.markAsPristine();
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