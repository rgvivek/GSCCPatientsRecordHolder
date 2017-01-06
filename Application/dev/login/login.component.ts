import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'app/patient/patient.service';
import { User } from 'app/user/user';

@Component({
    selector: 'nsf-login',
    templateUrl:"app/login/login.html"
})

export class LoginComponent implements OnInit{
	private logInForm:ControlGroup;
	private logInButtonClicked:boolean = false;
	private status:string;

	constructor(private patientService: PatientService, private router: Router, private fb: FormBuilder) {
		this.logInButtonClicked = false;
		this.logInForm = fb.group({
			'username' : [null, Validators.required],
		    'password' : [null, Validators.required]
		});
	};
	
	login(formData : any): void {
		this.logInButtonClicked = true;
		this.status = null;
		if(this.logInForm.valid){
			this.patientService.loginUser(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.logInButtonClicked = false;
			  		switch(status){
			  			case 0:{
			  				let link = ['/main'];
							this.router.navigate(link);
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