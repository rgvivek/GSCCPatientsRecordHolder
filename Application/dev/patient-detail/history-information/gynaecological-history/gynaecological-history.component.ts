import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-gynaecological-history',
    templateUrl:"app/patient-detail/history-information/gynaecological-history/gynaecological-history.html"
})

export class GynaecologicalHistoryComponent{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	private bleedingPainList:Array<string> = ['No Pain', 'Moderate', 'Severe'];
	private gynaecologicalHistoryForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	
	constructor(private patientService: PatientService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patientHistory){
			this.gynaecologicalHistoryForm = this.fb.group({
				'patienthistoryid':[this.patientHistory.id],
				'onsetage' : [this.patientHistory.onsetage],
			    'stoppedage' : [this.patientHistory.stoppedage],
			    'bleedingduration' : [this.patientHistory.bleedingduration],
			    'bleedingpain' : [this.patientHistory.bleedingpain],
			    'ovulationpain' : [this.patientHistory.ovulationpain],
			    'menopausereached' : [this.patientHistory.menopausereached],
			    'cycleduration' : [this.patientHistory.cycleduration]
			});
			this.gynaecologicalHistoryForm.valueChanges.subscribe(data=>{
				this.patientHistory.onsetage = data.onsetage;
				this.patientHistory.menopausereached = data.menopausereached;
			});
		}
	};

	savePatientHistory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.gynaecologicalHistoryForm.valid && this.gynaecologicalHistoryForm.dirty){
			this.patientService.saveFemalePatientHistory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.gynaecologicalHistoryForm.markAsPristine();
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