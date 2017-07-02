import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-personal-history',
    templateUrl:"app/patient-detail/history-information/personal-history/personal-history.html"
})

export class PersonalHistoryComponent{
@Input() patientHistory:PatientHistory = new PatientHistory();
	private smokingList:Array<string> = ['Non-Smoker', 'Occasional Smoker', 'Social Smoker', 'Chain Smoker'];
	private alcoholList:Array<string> = ['Non-Alcoholic', 'Occasional Drinker', 'Social Drinker', 'Addicted'];
	private chewingList:Array<string> = ['Non-Chewer', 'Occasional Chewer', 'Social Chewer', 'Addicted'];
	private eatingHabits:Array<string> = ['Vegan', 'Vegetarian', 'Non-Vegetarian'];
	private personalHistoryForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.personalHistoryForm = this.fb.group({
				'id':[this.patientHistory.id],
				'patientid':[this.patientHistory.patientid],
				'smoking' : [this.patientHistory.smoking, Validators.required],
			    'alcohol' : [this.patientHistory.alcohol, Validators.required],
			    'chewing' : [this.patientHistory.chewing, Validators.required],
			    'eatinghabit' : [this.patientHistory.eatinghabit, Validators.required]
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.personalHistoryForm.valid && this.personalHistoryForm.dirty){
			this.patientService.savePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.personalHistoryForm.markAsPristine();
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