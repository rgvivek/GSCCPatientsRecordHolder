import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'create-user',
    templateUrl:"app/create-user/create-user.html"
})

export class CreateUserComponent{
	private signUpForm:ControlGroup;
	private signUpButtonClicked:boolean = false;
	private status:string;

	constructor(private patientService: PatientService, private fb: FormBuilder) {
		this.signUpButtonClicked = false;
		this.signUpForm = fb.group({
			'firstname' : [null, Validators.required],
		    'lastname' : [null, Validators.required],
		    'username' : [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
		    'password' : [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
		    'isadmin' : false
		});
	};
	
	signUp(formData : any): void {
		this.signUpButtonClicked = true;
		this.status = null;
		if(this.signUpForm.valid){
			this.patientService.signUpUser(formData).subscribe(
			  	response => {
			  		var status = response.status;
			  		this.signUpButtonClicked = false;
			  		switch(status){
			  			case 6:{
			  				this.status = 'success';
			  				this.signUpForm.reset();
			  				break;
			  			}
			  			case 3:{
			  				this.status = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  this.errorMessage = <any>error);
		  	);
	  	}
	}
}