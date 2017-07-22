import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-family-history',
    templateUrl:"app/patient-detail/history-information/family-history/family-history.html"
})

export class FamilyHistoryComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private maritalStatusList:Array<string> = ['Single', 'Married', 'Divorced', 'Widow'];
	private familyHistoryForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.familyHistoryForm = this.fb.group({
				'id':[this.patientHistory.id],
				'patientid':[this.patientHistory.patientid],
				'siblingscount' : [this.patientHistory.siblingscount, Validators.compose([Validators.required, Validators.pattern])],
			    'maritalstatus' : [this.patientHistory.maritalstatus, Validators.required],
			    'kidscount' : [this.patientHistory.kidscount, Validators.compose([Validators.required, Validators.pattern])],
			    'ageofmarriage' : [this.patientHistory.ageofmarriage, Validators.compose([Validators.required, Validators.pattern])]
			});
			this.familyHistoryForm.valueChanges.subscribe(data=>{
				this.patientHistory.siblingscount = data.siblingscount;
				this.patientHistory.maritalstatus = data.maritalstatus;
				this.patientHistory.kidscount = data.kidscount;
				this.patientHistory.ageofmarriage = data.ageofmarriage;
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.familyHistoryForm.valid && this.familyHistoryForm.dirty){
			this.patientService.savePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.patientHistory.id = response.id;
			  				this.familyHistoryForm.markAsPristine();
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