import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'add-patient',
    templateUrl:"app/add-patient/add-patient.html"
})

export class AddPatientComponent{
	private sexList:Array<string> = ['Male', 'Female'];
	private patient:Patient;
	private addPatientForm:ControlGroup;
	private addPatientButtonClicked:boolean = false;
	private status:string;

	constructor(private patientService: PatientService, private router: Router, private fb: FormBuilder) { 
		this.addPatientButtonClicked = false;
		this.addPatientForm = fb.group({
			'firstname' : [null, Validators.required],
		    'lastname' : [null, Validators.required],
		    'fathersname' : [null, Validators.required],
		    'sex' : [null, Validators.required],
		    'dateofbirth' : [null, Validators.required]
		});
		this.todaysDate = this.getDateAsString(new Date());
	};

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
	
	addPatient(formData : any): void {
		this.addPatientButtonClicked = true;
		this.status = null;
		if(this.addPatientForm.valid){
			this.patientService.savePatient(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.addPatientButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				let patientId = response.patientId;
			  				if(patientId){
			  					let link = ['/patients/'+patientId];
								this.router.navigate(link);
			  				}else{
			  					this.status = 'error';
			  					this.errorMessage = "Problem creting patient. Please try again later.";
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