import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-general-information',
    templateUrl:"app/patient-detail/general-information/general-information.html"
})

export class GeneralInformationComponent implements OnInit{
	private sexList:Array<string> = ['Male', 'Female'];
	@Input() patient:Patient = new Patient();
	private generalInfoForm:ControlGroup;
	private generalInfoButtonClicked:boolean = false;
	private status:string;
	private fb: FormBuilder = new FormBuilder();

	constructor(private patientService: PatientService, private router: Router) { 
		this.generalInfoButtonClicked = false;
		this.todaysDate = this.getDateAsString(new Date());
	};

	ngOnChanges(changes: any) {
		if(this.patient){
			this.generalInfoForm = this.fb.group({
				'id':[this.patient.id],
				'firstname' : [this.patient.firstname, Validators.required],
			    'lastname' : [this.patient.lastname, Validators.required],
			    'fathersname' : [this.patient.fathersname, Validators.required],
			    'sex' : [this.patient.sex, Validators.required],
			    'dateofbirth' : [this.patient.dateofbirth, Validators.required],
			    'occupation' : [this.patient.occupation, Validators.required],
			    'monthlyincome' : [this.patient.monthlyincome, Validators.compose([Validators.required, Validators.pattern])],
			    'emailid' : [this.patient.emailid, Validators.compose([Validators.required, Validators.pattern])],
			    'mobilenumber' : [this.patient.mobilenumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern])]
			});
		}
	}

	getDateAsString(inputDate : Date):string{
		let month = inputDate.getMonth() + 1;
	    let day = inputDate.getDate();
	    let year = inputDate.getFullYear();

	    if(month < 10)
	        month = '0' + month.toString();
	    if(day < 10)
	        day = '0' + day.toString();

	    return year + '-' + month + '-' + day;    
	}
	
	savePatient(formData : any): void {
		this.generalInfoButtonClicked = true;
		this.status = null;
		if(this.generalInfoForm.valid){
			this.patientService.savePatient(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.generalInfoButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				let patientId = response.patientId;
			  				if(patientId){
			  					let link = ['/patients/'+patientId];
								this.router.navigate(link);
			  				}else{
			  					this.status = 'error';
			  					this.errorMessage = "Problem saving patient details. Please try again later.";
			  				}
			  				break;
			  			}
			  			case 1:{
			  				this.status = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  this.errorMessage = <any>error
			);
		}
	}
}